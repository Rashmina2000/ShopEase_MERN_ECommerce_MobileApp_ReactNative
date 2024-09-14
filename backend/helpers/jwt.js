const { expressjwt } = require("express-jwt");

function authJwt() {
  return expressjwt({
    secret: "secret",
    algorithms: ["HS256"],
  }).unless({
    path: ["/api/v1/users/login"],
  });
}

module.exports = authJwt;
