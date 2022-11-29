import express from "express";
import AuthToken from "../../../utils/verify-user/VerifyUser.js";
const cryptoRoutesGets = express.Router();

const allRoutes = [];
allRoutes.map(({ name, auth, rout }) => {
  if (auth) {
    if (rout) {
      cryptoRoutesGets.use(`/get/search${rout}:token`, AuthToken, name);
    } else {
      cryptoRoutesGets.use(`/`, name);
    }
  } else {
    if (rout) {
      cryptoRoutesGets.use(`/get/search${rout}`, name);
    } else {
      cryptoRoutesGets.use(`/`, name);
    }
  }
});
// cryptoRoutesGets.get("/get/search/all-search", (req, res) => {
//   console.log("2sd");
//   res.json("ASPO");
// });

export default cryptoRoutesGets;
