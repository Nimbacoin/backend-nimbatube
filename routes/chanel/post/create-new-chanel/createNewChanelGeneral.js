import express from "express";
import User from "../../../../db/schema/user.js";
import ChanelModal from "../../../../db/schema/chanel.js";
const routerCreateNewChanelGeneral = express.Router();

routerCreateNewChanelGeneral.post("/", async (req, res) => {
  const ReqUserId = req.userId;
  const { title, name, description } = req.body;
  const userId = req.userId;
  await User.findOne({ _id: userId }).then((docadded) => {
    if (docadded) {
      ChanelModal.create({
        creator: ReqUserId,
        chanelData: { title, name, description },
      }).then((chanel) => {
        res.json({ "respons-data": chanel });
      });
    } else if (!docadded) {
      res.json({
        message: "EamilNotFinded",
      });
    }
  });
});

export default routerCreateNewChanelGeneral;
