
const crypto = require('crypto');

function base64Url(str) {
    return Buffer.from(str).toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

const header = {
    alg: 'HS256',
    typ: 'JWT'
};

const payload = {
    sub: 'mock-admin-id',
    email: 'admin@example.com',
    preferred_username: 'admin',
    realm_access: {
        roles: ['ADM']
    },
    resource_access: {
        'kompass-api': {
            roles: ['ADM']
        }
    },
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    iat: Math.floor(Date.now() / 1000),
    iss: 'http://localhost:8080/realms/kompass',
    aud: 'kompass-api'
};

const secret = 'mock-secret-for-development';

const encodedHeader = base64Url(JSON.stringify(header));
const encodedPayload = base64Url(JSON.stringify(payload));
const content = `${encodedHeader}.${encodedPayload}`;

const signature = crypto.createHmac('sha256', secret)
    .update(content)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

const token = `${content}.${signature}`;
console.log(token);
