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
              const userUnicId = users.filter(
                ({ unicId }) => unicId === querySessionStorageUnicId
              );

              if (userUnicId.length <= 0) {
                users.push({
                  email,
                  id: docadded._id.toString(),
                  socketId: socket.id,
                  unicId: querySessionStorageUnicId,
                });
              }
            } else {
              io.to(socket.id).emit("unicId", unicId);
            }
            //
          }
        });

        socket.on("send-id", async (userDataClient) => {
          var reqParamsToken = socket.handshake.headers.cookie;
          console.log(reqParamsToken);
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
              await userModal
                .findOne({ email: email })
                .then(async (docadded) => {
                  if (docadded) {
                    if (
                      userDataClient &&
                      typeof userDataClient !== "undefined"
                    ) {
                      const userUnicId = users.filter(
                        ({ unicId }) => unicId === userDataClient
                      );
                      if (userUnicId.length >= 1) {
                        const Indexd = users.findIndex(
                          ({ unicId }) => unicId === userDataClient
                        );
                        if (users >= 0) {
                          users[Indexd].socketId = socket.id;
                          console.log(socket.id);
                        }
                      } else if (userUnicId.length <= 0) {
                        users.push({
                          email,
                          id: docadded._id.toString(),
                          socketId: socket.id,
                          unicId: userDataClient,
                        });
                      }
                      console.log("user in", userDataClient, socket.id);
                    }
                  }
                });
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
                const followers = channel.followers;
                followers.map(async (userfollowers) => {
                  if (users.some(({ id }) => id === userfollowers.id)) {
                    console.log("user online", userfollowers.id);
                    const indexUser = users.findIndex(
                      ({ id }) => id === userfollowers.id
                    );
                    if (indexUser.id) {
                      await User.findOne({ _id: indexUser.id }).then(
                        async (docadded) => {
                          console.log(data);
                          const notification = docadded.notification;
                          let videoId;
                          await Promise.all(
                            notification.map(async (item, index) => {
                              videoId = item.from.videoId;
                              await videoModal
                                .findOne({ _id: videoId })
                                .then(async (histyVid) => {
                                  let channelId;
                                  if (histyVid) {
                                    channelId = histyVid.channelId;
                                    await channelModal
                                      .findOne({ _id: channelId })
                                      .then(async (channel) => {
                                        const data = {
                                          index: index,
                                          vid: item,
                                          channelData: channel,
                                          videoData: histyVid,
                                        };
                                      });
                                  }
                                });
                            })
                          );
                        }
                      );
                    }

                    const idUserOnLine = users[indexUser]?.socketId;

                    io.to(idUserOnLine).emit(
                      "nofy-new-video",
                      "idUserOnLine",
                      "message"
                    );
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
    if (indexUser >= 0) {
      console.log("user loged out", users[indexUser]?.email);
      users.splice(indexUser, 1);
      console.log(users);
    } else {
      console.log("user loged out");
    }
  });
};

export default notification;
