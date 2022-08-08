import express from "express";
import routesChanelGet from "./get/chanelgets.js";
import routesChanelPosts from "./post/chanelposts.js";

const routesChanel = express.Router();
routesChanel.use("/", routesChanelGet);
routesChanel.use("/", routesChanelPosts);

export default routesChanel;
