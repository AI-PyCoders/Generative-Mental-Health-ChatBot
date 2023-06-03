import jwt from "jsonwebtoken";
const jwtSecret = "capstone_project_hgvcfghjb";

//For generate a jwt token
function generateToken(id, ios) {
  let token = jwt.sign({ userId: id, ios: ios ? ios : false }, jwtSecret, {});
  return token;
}

//For verify a jwt token
function verifyToken(req, res, next) {
  let token = req.headers["x-access-token"] || req.headers["authorization"]; // Express headers are auto converted to lowercase
  if (token) {
    if (token.startsWith("Bearer ")) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }
    jwt.verify(token, jwtSecret, async (err, user) => {
      if (err) {
        return res.status(440).json({
          status: 440,
          message: "Session Expired",
        });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    return res.status(440).json({
      status: 440,
      message: "Auth token is not supplied",
    });
  }
}

export { generateToken, verifyToken };
