import express from "express";
import channelModal from "../../../db/schema/channel.js";
import User from "../../../db/schema/user.js";
const searching = express.Router();

searching.post("/", async (req, res) => {
  const tr = 1600;
  const double = 60;
  const single = 40;

  const sdfsdfdf = new Array(20).fill().map((_, i) => {
    const bb = i + 1;
    return bb;
  });

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

  myNewARRAY.map((i, ii) => {
    if (i <= 18) {
      const newss = (double / 2) * i;
      const forday = newss * 7;
      const ddd = forday + 1600;
      const lastdat = ddd / i;
    }
  });

  addondesFunc.map((i, ii) => {
    if (i <= 18) {
      const iiiiiii = i - 1;
      const newss = (double / 2) * iiiiiii;
      const priceddd = single * 7;
      const forday = newss * 7;
      const ddd = forday + priceddd + 1600;
      const lastdat = ddd / i;
    }
  });
});

export default searching;
