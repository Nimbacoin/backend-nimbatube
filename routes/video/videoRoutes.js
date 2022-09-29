import express from "express";
import videoRoutesGets from "./get/videoRoutesGets.js";
import videoRoutesPosts from "./post/videoRoutesPosts.js";
const videoRoutes = express.Router();
// videoRoutes.get("/get/video/display", (rq, res) => {
//   console.log("video");
//   res.json([]);
// });
videoRoutes.use("/", videoRoutesGets);
videoRoutes.use("/", videoRoutesPosts);
// videoRoutes.use("/", videoRoutesDeletes);

export default videoRoutes;
