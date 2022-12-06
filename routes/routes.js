import express from "express";
const Routes = express.Router();
import routesAuth from "./auth/auth.js";
import routesChannel from "./channel/channel.js";
// import videoRoutes from "./video/videoRoutes.js";
// import tag from "../db/schema/tag.js";
// import imagesRoutes from "./images/imagesRoutes.js";
// import liveStream from "./live-stream/liveStream.js";
// import searchRoutes from "./search/searchRoutes.js";
// import cryptoRoutes from "./crypto/cryptoRoutes.js";

Routes.use("/api", routesAuth);
Routes.use("/api", routesChannel);
// Routes.use("/api", videoRoutes);
// Routes.use("/api", liveStream);
// Routes.use("/api", imagesRoutes);

// Routes.use("/api", cryptoRoutes);

// Routes.use("/api/get/search/all-search", (req, res) => {
//   console.log("·SD");
//   res.json("s´f");
// });
// Routes.use("/api", searchRoutes);

// Routes.post("/api/add-tag", async (req, res) => {
//   const tagValue = req.body.tag;
//   console.log("hererer tags ");
//   await tag.create({ tag: tagValue }).then((tagDoc) => {
//     console.log(tagDoc);
//     res.json({ data: tagDoc });
//   });
// });

export default Routes;
