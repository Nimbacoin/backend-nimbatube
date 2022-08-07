import express from "express";
const Routes = express.Router();

const allRoutes = [{ name: "" }];

allRoutes.map(({ name }) => {
  Routes.post("/api", name);
});

export default Routes;
