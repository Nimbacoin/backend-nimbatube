import express from "express";
import channelModal from "../../../db/schema/channel.js";
import User from "../../../db/schema/user.js";
const searching = express.Router();

searching.post("/", async (req, res) => {
  const tr = 1600;
  const hotel = 95;

  const sdfsdfdf = new Array(20).fill().map((_, i) => {
    const bb = i + 1;
    return bb;
  });
  // console.log(sdfsdfdf);

  function multiplesOf(numList, num) {
    return numList.filter(function (n) {
      return n % num === 0;
    });
  }

  function addondes(numList) {
    return numList.filter(function (n) {
      return n % 2 != 0;
    });
  }

  const myNewARRAY = multiplesOf(sdfsdfdf, 2);
  const addondesFunc = addondes(sdfsdfdf);
  console.log(myNewARRAY);
  console.log(addondesFunc);
  myNewARRAY.map((i, ii) => {
    if (i <= 18) {
      const newss = 30 * i;
      const forday = newss * 7;
      const ddd = forday + 1600;
      const lastdat = ddd / i;
      console.log("price if people are ", i, "is", lastdat + "€");
    }
  });

  addondesFunc.map((i, ii) => {
    if (i <= 18) {
      const iiiiiii = -1;
      const newss = 30 * iiiiiii;
      const priceddd = 40 * 7;
      const forday = newss * 7;
      const ddd = forday + priceddd + 1600;
      const lastdat = ddd / i;
      console.log("price if people are ", i, "is", lastdat + "€");
    }
  });
});

export default searching;
