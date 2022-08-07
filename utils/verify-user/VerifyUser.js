import jwt from "jsonwebtoken";

const AuthToken = async (req, res, next) => {
  const Cookies = JSON.stringify(req.cookies);
  if (Cookies) {
    const CookiesParsed = JSON.parse(Cookies);
    const User = CookiesParsed.user;
    if (typeof User !== "undefined") {
      const UserParsed = JSON.parse(User);
      const accesToken = UserParsed.accessToken;
      const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
      console.log("accessTokenSecret:", accessTokenSecret);
      console.log("accesToken : ", accesToken);
      jwt.verify(accesToken, accessTokenSecret, function (err, decoded) {
        if (!err) {
          req.userId = decoded;
          console.log("req.userId1", req.userId);
          const UserIdReq = req.userId;
          if (typeof UserIdReq !== "undefined") {
            console.log("req.user2", req.userId);
            next();
          }
        }
      });
    } else {
      console.log("user not founded");
    }
  }
};
export default AuthToken;
