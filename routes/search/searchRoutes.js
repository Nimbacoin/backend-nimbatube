import express from "express";
import searchRoutesGets from "./get/searchRoutesGets.js";
import searchRoutesPosts from "./post/searchRoutesPosts.js";
const searchRoutes = express.Router();
// searchRoutes.get("/get/search/display", (rq, res) => {
//   console.log("search");
//   res.json([]);
// });
searchRoutes.use("/", searchRoutesGets);
searchRoutes.use("/", searchRoutesPosts);
// searchRoutes.get("/get/search/all-search", (req, res) => {
//   console.log("2sd");
//   res.json("aposdcaopcoapscaopsc");
// });
// searchRoutes.use("/", searchRoutesDeletes);

export default searchRoutes;
