import express from "express";
const Routes = express.Router();
import routesAuth from "./auth/auth.js";
import routesChanel from "./chanel/chanel.js";

const allRoutes = [{ name: routesAuth }, { name: routesChanel }];

// const AuthToken = async (
//   req
//   res
//   next
// ) => {
//   const accesToken = req.params.token;
//   const SECRETS = await AwsSecrets.getInstance();
//   const accessTokenSecret = SECRETS.JWT_ACCESS_TOKEN_SECRET;
//   jwt.verify(
//     accesToken,
//     accessTokenSecret,
//     function (err: any, decoded: decoded) {
//       if (typeof accesToken !== "undefined" && !err) {
//         req.user = decoded.UserId;
//         const UserIdReq: string = decoded?.UserId;
//         if (typeof UserIdReq !== "undefined") {
//           next();
//         }
//       }
//     }
//   );
// };
allRoutes.map(({ name }) => {
  Routes.use("/api", name);
});

export default Routes;
