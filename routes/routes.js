import express from "express";
const Routes = express.Router();
import routesAuth from "./auth/auth.js";
import routesChannel from "./channel/channel.js";
import videoRoutes from "./video/videoRoutes.js";
import tag from "../db/schema/tag.js";
import imagesRoutes from "./images/imagesRoutes.js";
import liveStream from "./live-stream/liveStream.js";
// const allRoutes = [{ name: routesAuth, auth: false }, { name: routesChanel }];

// Routes.get("/api/get/video/display", (rq, rs) => {
//   console.log("video");
//   rs.json([]);
// });
Routes.use("/api", liveStream);
Routes.use("/api", imagesRoutes);
Routes.use("/api", videoRoutes);
Routes.use("/api", routesAuth);
Routes.use("/api", routesChannel);

Routes.post("/api/add-tag", async (req, res) => {
  const tagValue = req.body.tag;
  console.log("hererer tags ");
  await tag.create({ tag: tagValue }).then((tagDoc) => {
    console.log(tagDoc);
    res.json({ data: tagDoc });
  });
});

export default Routes;
