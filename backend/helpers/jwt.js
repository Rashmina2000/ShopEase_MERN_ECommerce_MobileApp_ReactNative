const { expressjwt } = require("express-jwt");

function authJwt() {
  return expressjwt({
    secret: "secret",
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] }, // allow all APIs starting with api/v1/products
      { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },

      "/api/v1/users/login",
      "/api/v1/users/register",
    ],
  });
}

async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    return false;
  }

  return true;
}

module.exports = authJwt;
