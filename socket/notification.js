import videoModal from "../db/schema/video.js";
import streamingVideo from "./streaming/streamingVideo.js";
import cookie from "cookie";
import channelModal from "../db/schema/channel.js";
import userModal from "../db/schema/user.js";
import { v4 as uuidv4 } from "uuid";

let users = [];

const notification = (io, socket) => {
  io.on("connection", async () => {
    var reqParamsToken = socket.handshake.headers.cookie;
    if (
      typeof reqParamsToken !== "undefined" &&
      reqParamsToken !== "undefined" &&
      reqParamsToken.length > 20
    ) {
      const CookiesParsed = cookie.parse(reqParamsToken);
      const User = CookiesParsed.user;
      if (typeof User !== "undefined") {
        const userTokken = JSON.parse(User);
        const email = userTokken.email;
        const unicId = uuidv4();

        await userModal.findOne({ email: email }).then(async (docadded) => {
          if (docadded) {
            const querySessionStorageUnicId =
              socket.handshake.query.sessionStorageUnicId;
            if (
              querySessionStorageUnicId &&
              typeof querySessionStorageUnicId !== "undefined" &&
              querySessionStorageUnicId.length >= 12
            ) {
              console.log(
                "querySessionStorageUnicId",
                querySessionStorageUnicId
              );
              const userUnicId = users.filter(
                ({ unicId }) => unicId === querySessionStorageUnicId
              );

              const userId = users.filter(
                ({ id }) => id === docadded._id.toString()
              );
              //  console.log(userUnicId, userId, "exsiteed");
            } else {
              const userId = users.filter(
                ({ id }) => id === docadded._id.toString()
              );
              users.push({
                email,
                id: docadded._id.toString(),
                socketId: socket.id,
                unicId: unicId,
              });

              console.log(querySessionStorageUnicId, "userId", userId, "new");
              io.to(socket.id).emit("unicId", unicId);
            }
          }
        });

        socket.on("notification", async (data) => {
          console.log("notification");
          channelModal
            .findOne({ _id: data?.channelId })
            .then(async (channel) => {
              if (channel) {
                let allOnlineUsers = [];
                console.log("notification", "data");
                //  console.log("users", users);
                const followers = channel.followers;
                followers.map((userfollowers) => {
                  if (users.some(({ id }) => id === userfollowers.id)) {
                    console.log("user online", userfollowers);
                    const indexUser = users.findIndex(
                      ({ id }) => id === userfollowers.id
                    );

                    console.log("videos emited");
                    const idUserOnLine = users[indexUser]?.socketId;
                    socket
                      .to(idUserOnLine)
                      .emit("nofy-new-video", "idUserOnLine", "message");
                  }

                });
              }
            });
        });
      }
    }
  });
  socket.on("disconnect", () => {
    const indexUser = users.findIndex(({ socketId }) => socketId === socket.id);
    console.log(
      "user loged out",
      indexUser,
      " ",
      socket.id,
      users[indexUser]?.email
    );
    users.splice(indexUser, 1);
    //console.log(users);
  });
};

export default notification;
