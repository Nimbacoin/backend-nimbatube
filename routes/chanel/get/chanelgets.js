import express from "express";
const Routes = express.Router();

const allRoutes = [{ name: "" }];

allRoutes.map(({ name }) => {
  Routes.get("/api", name);
});

export default Routes;
