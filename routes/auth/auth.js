import express from "express";
import routerSignIn from "./signin/signin.js";
import routerSignUp from "./signup/signup.js";

const routesAuth = express.Router();

routesAuth.use("/auth/sign-in", routerSignIn);
routesAuth.use("/auth/sign-up", routerSignUp);

export default routesAuth;
