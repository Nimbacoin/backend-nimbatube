import express from "express";
import ChanelModal from "../../../db/schema/chanel.js";
import User from "../../../db/schema/user.js";
// import ChanelModal from "../../../db/schema/chanel";
// import User from "../../../db/schema/user";
const deleteChanel = express.Router();

deleteChanel.delete("/", async (req, res) => {
  const { chanelId } = req.body;
  const userId = req.userId;

  await User.findOne({ _id: userId }).then(async (docadded) => {
    if (docadded) {
      try {
        await ChanelModal.findByIdAndRemove({ _id: chanelId }).then(
          async (delted) => {
            await ChanelModal.find({ creator: userId }).then((chanels) => {
              if (chanels.length) {
                console.log(chanelId);
                res.json({ responsData: chanels });
              } else {
                res.json({ responsMessage: "NoChanelFounded" });
              }
            });
          }
        );
      } catch (error) {
        return null;
      }
    } else if (!docadded) {
      res.json({
        message: "EamilNotFinded",
      });
    }
  });
});

export default deleteChanel;
