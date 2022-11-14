import express from "express";
const allSearch = express.Router();

allSearch.get("/", async (req, res) => {
  console.log("search");
  res.json("sdl");
});

export default allSearch;
//dfg
