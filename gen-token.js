
const jwt = require('jsonwebtoken');

const payload = {
    sub: 'mock-admin-id',
    email: 'admin@example.com',
    preferred_username: 'admin',
    realm_access: {
        roles: ['ADM']
    },
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
    iat: Math.floor(Date.now() / 1000),
    iss: 'http://localhost:8080/realms/kompass',
    aud: 'kompass-api'
};

const secret = 'mock-secret-for-development';
const token = jwt.sign(payload, secret);
console.log(token);
