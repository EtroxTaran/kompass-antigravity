#!/bin/bash
# Server Setup Script for KOMPASS Deployment
# Automates the setup of staging or production servers
#
# Usage: 
#   curl -fsSL https://raw.githubusercontent.com/<your-org>/kompass/main/scripts/server-setup.sh | bash -s <environment>
#   OR
#   bash scripts/server-setup.sh <environment>
#
# Arguments:
#   environment: staging or production

set -e

ENVIRONMENT=${1:-staging}

if [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
    echo "❌ Invalid environment. Use 'staging' or 'production'"
    echo "Usage: bash server-setup.sh <environment>"
    exit 1
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 KOMPASS Server Setup - $ENVIRONMENT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  This script requires root privileges"
    echo "   Please run with sudo or as root user"
    exit 1
fi

# ============================================================================
# 1. Update system
# ============================================================================
echo "1️⃣  Updating system packages..."
apt-get update
apt-get upgrade -y
echo "   ✅ System updated"

# ============================================================================
# 2. Install Docker
# ============================================================================
echo ""
echo "2️⃣  Installing Docker..."

if command -v docker &> /dev/null; then
    echo "   ℹ️  Docker already installed: $(docker --version)"
else
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    echo "   ✅ Docker installed: $(docker --version)"
fi

# ============================================================================
# 3. Install Docker Compose
# ============================================================================
echo ""
echo "3️⃣  Installing Docker Compose..."

if command -v docker-compose &> /dev/null; then
    echo "   ℹ️  Docker Compose already installed: $(docker-compose --version)"
else
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo "   ✅ Docker Compose installed: $(docker-compose --version)"
fi

# ============================================================================
# 4. Install additional tools
# ============================================================================
echo ""
echo "4️⃣  Installing additional tools..."
apt-get install -y curl wget git jq vim nano
echo "   ✅ Tools installed"

# ============================================================================
# 5. Create deployment user
# ============================================================================
echo ""
echo "5️⃣  Creating deployment user..."

if id "deploy" &>/dev/null; then
    echo "   ℹ️  User 'deploy' already exists"
else
    useradd -m -s /bin/bash deploy
    usermod -aG docker deploy
    echo "   ✅ User 'deploy' created and added to docker group"
fi

# ============================================================================
# 6. Create directory structure
# ============================================================================
echo ""
echo "6️⃣  Creating directory structure..."

DEPLOY_DIR="/opt/kompass/$ENVIRONMENT"

mkdir -p "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR/data/couchdb"
mkdir -p "$DEPLOY_DIR/data/meilisearch"
mkdir -p "$DEPLOY_DIR/data/keycloak"
mkdir -p "$DEPLOY_DIR/config/couchdb"
mkdir -p "$DEPLOY_DIR/config/nginx"
mkdir -p "$DEPLOY_DIR/backups"
mkdir -p "$DEPLOY_DIR/logs"
mkdir -p "$DEPLOY_DIR/scripts"
mkdir -p "$DEPLOY_DIR/certs"

chown -R deploy:deploy "$DEPLOY_DIR"
chmod 750 "$DEPLOY_DIR"

echo "   ✅ Directory structure created at $DEPLOY_DIR"

# ============================================================================
# 7. Set up SSH for deploy user
# ============================================================================
echo ""
echo "7️⃣  Setting up SSH for deploy user..."

sudo -u deploy mkdir -p /home/deploy/.ssh
sudo -u deploy chmod 700 /home/deploy/.ssh
sudo -u deploy touch /home/deploy/.ssh/authorized_keys
sudo -u deploy chmod 600 /home/deploy/.ssh/authorized_keys

echo "   ✅ SSH directory created"
echo ""
echo "   ⚠️  MANUAL STEP REQUIRED:"
echo "   Add your GitHub Actions public SSH key to:"
echo "   /home/deploy/.ssh/authorized_keys"
echo ""
echo "   You can do this with:"
echo "     sudo nano /home/deploy/.ssh/authorized_keys"
echo "   Then paste the public key and save."

# ============================================================================
# 8. Configure firewall (optional but recommended)
# ============================================================================
echo ""
echo "8️⃣  Configuring firewall (UFW)..."

if command -v ufw &> /dev/null; then
    # Allow SSH
    ufw allow 22/tcp
    # Allow HTTP/HTTPS
    ufw allow 80/tcp
    ufw allow 443/tcp
    # Enable firewall
    echo "y" | ufw enable
    echo "   ✅ Firewall configured"
else
    apt-get install -y ufw
    ufw allow 22/tcp
    ufw allow 80/tcp
    ufw allow 443/tcp
    echo "y" | ufw enable
    echo "   ✅ Firewall installed and configured"
fi

# ============================================================================
# 9. Set up log rotation
# ============================================================================
echo ""
echo "9️⃣  Setting up log rotation..."

cat > /etc/logrotate.d/kompass <<EOF
$DEPLOY_DIR/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 deploy deploy
    sharedscripts
    postrotate
        docker-compose -f $DEPLOY_DIR/docker-compose.yml logs --tail=0 >/dev/null 2>&1 || true
    endscript
}
EOF

echo "   ✅ Log rotation configured"

# ============================================================================
# 10. Create environment file template
# ============================================================================
echo ""
echo "🔟  Creating environment file template..."

if [ "$ENVIRONMENT" = "staging" ]; then
    ENV_FILE="$DEPLOY_DIR/.env.staging"
else
    ENV_FILE="$DEPLOY_DIR/.env.production"
fi

sudo -u deploy touch "$ENV_FILE"
sudo -u deploy chmod 600 "$ENV_FILE"

echo "   ✅ Environment file created: $ENV_FILE"
echo ""
echo "   ⚠️  MANUAL STEP REQUIRED:"
echo "   Edit $ENV_FILE and fill in actual values"
echo "   Template: .env.${ENVIRONMENT}.example"
echo ""
echo "   You can do this with:"
echo "     sudo -u deploy nano $ENV_FILE"

# ============================================================================
# 11. Set up automatic backups (production only)
# ============================================================================
if [ "$ENVIRONMENT" = "production" ]; then
    echo ""
    echo "1️⃣1️⃣  Setting up automatic backups..."
    
    # Create backup script
    cat > "$DEPLOY_DIR/scripts/backup-couchdb.sh" <<'EOF'
#!/bin/bash
BACKUP_DIR="/opt/kompass/production/backups"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
mkdir -p "$BACKUP_DIR"

# Create CouchDB backup
docker exec kompass-couchdb curl -X POST \
  http://admin:${PRODUCTION_COUCHDB_PASSWORD}@localhost:5984/_replicate \
  -H "Content-Type: application/json" \
  -d "{\"source\":\"kompass\",\"target\":\"kompass_backup_$TIMESTAMP\",\"create_target\":true}"

# Delete backups older than 30 days
find "$BACKUP_DIR" -name "kompass_backup_*" -mtime +30 -delete

echo "✅ Backup completed: kompass_backup_$TIMESTAMP"
EOF

    chmod +x "$DEPLOY_DIR/scripts/backup-couchdb.sh"
    chown deploy:deploy "$DEPLOY_DIR/scripts/backup-couchdb.sh"
    
    # Add to crontab for deploy user
    (sudo -u deploy crontab -l 2>/dev/null; echo "0 2 * * * $DEPLOY_DIR/scripts/backup-couchdb.sh >> $DEPLOY_DIR/logs/backup.log 2>&1") | sudo -u deploy crontab -
    
    echo "   ✅ Automatic daily backups configured (2 AM)"
fi

# ============================================================================
# 12. Install SSL certificates (optional)
# ============================================================================
echo ""
echo "1️⃣2️⃣  SSL Certificate Setup..."
echo "   ℹ️  SSL certificates not configured"
echo ""
echo "   To set up Let's Encrypt SSL:"
echo "     apt-get install -y certbot"
echo "     certbot certonly --standalone -d $ENVIRONMENT.kompass.de"
echo "     cp /etc/letsencrypt/live/$ENVIRONMENT.kompass.de/fullchain.pem $DEPLOY_DIR/certs/"
echo "     cp /etc/letsencrypt/live/$ENVIRONMENT.kompass.de/privkey.pem $DEPLOY_DIR/certs/"
echo "     chown deploy:deploy $DEPLOY_DIR/certs/*"

# ============================================================================
# Summary
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ SERVER SETUP COMPLETE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Environment: $ENVIRONMENT"
echo "Deploy Directory: $DEPLOY_DIR"
echo "Deploy User: deploy"
echo ""
echo "📋 Manual Steps Required:"
echo ""
echo "1. Add SSH public key to /home/deploy/.ssh/authorized_keys"
echo "   Command: sudo nano /home/deploy/.ssh/authorized_keys"
echo ""
echo "2. Edit environment file: $ENV_FILE"
echo "   Command: sudo -u deploy nano $ENV_FILE"
echo "   Template: .env.${ENVIRONMENT}.example"
echo ""
echo "3. Copy docker-compose files to $DEPLOY_DIR"
echo "   (These will be copied during first deployment)"
echo ""
echo "4. (Optional) Set up SSL certificates"
echo ""
echo "5. Test SSH connection:"
echo "   ssh deploy@<server-ip> 'echo Success'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next: Configure GitHub secrets and deploy!"
echo "See: docs/deployment/QUICK_START.md"
echo ""

