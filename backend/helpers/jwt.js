const { expressjwt } = require("express-jwt");

function authJwt() {
  return expressjwt({
    secret: "secret",
    algorithms: ["HS256"],
  }).unless({
    path: [
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] }, // allow all APIs starting with api/v1/products
      { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },

      "/api/v1/users/login",
      "/api/v1/users/register",
    ],
  });
}

module.exports = authJwt;
