import express from "express";
const Routes = express.Router();
import routesAuth from "./auth/auth.js";

Routes.use("/api", routesAuth);

export default Routes;
