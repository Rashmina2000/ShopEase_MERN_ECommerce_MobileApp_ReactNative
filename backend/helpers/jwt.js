const { expressjwt } = require("express-jwt");

function authJwt() {
  return expressjwt({
    secret: "secret",
    algorithms: ["HS256"],
  }).unless({
    path: ["/api/v1/users/login", "/api/v1/users/register"],
  });
}

module.exports = authJwt;
