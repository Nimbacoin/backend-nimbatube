import videoModal from "../db/schema/video.js";
import streamingVideo from "./streaming/streamingVideo.js";
import cookie from "cookie";
import channelModal from "../db/schema/channel.js";
import userModal from "../db/schema/user.js";

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
        const isInUser = users.some(({ email }) => email === email);
        // console.log(isInUser);
        if (isInUser) {
          const index = users.findIndex(({ email }) => email === email);
          //  console.log(index);
          if (index >= 0) {
            users[index].socketId = socket.id;
            //  console.log("socket id is changed");
          }
        } else {
          // console.log("new user added", email);
          await userModal.findOne({ email: email }).then(async (docadded) => {
            if (docadded) {
              users.push({
                email,
                id: docadded._id.toString(),
                socketId: socket.id,
              });
            }
          });
        }

        // console.log("users", users);
        socket.on("notification", async (data) => {
          channelModal
            .findOne({ _id: data?.channelId })
            .then(async (channel) => {
              if (channel) {
                let allOnlineUsers = [];
                console.log(channel);
                //console.log("notification", data);
                const followers = channel.followers;
                followers.map((user) => {
                  if (users.some(({ id }) => id === user.id)) {
                    console.log("user online", user);
                    //
                    const indexUser = users.findIndex(
                      ({ id }) => id === user.id
                    );
                    if (indexUser >= 0) {
                      const idUserOnLine = users[indexUser]?.socketId;
                      socket
                        .to(idUserOnLine)
                        .emit("nofy-new-video", "idUserOnLine", "message");
                    }
                    //
                  }
                });
                // users.map(() => {});
              }
            });

          //   socket.to(id).emit("offer", socket.id, message);
        });
      }
    }
  });
};

export default notification;
