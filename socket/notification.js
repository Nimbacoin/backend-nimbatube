import videoModal from "../db/schema/video.js";
import streamingVideo from "./streaming/streamingVideo.js";
import cookie from "cookie";

let users = [];

const notification = (io, socket) => {
  io.on("connection", () => {
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

        if (isInUser) {
          const index = users.findIndex(({ email }) => email === email);
          //  console.log(index);
          if (index >= 0) {
            users[index].socketId = socket.id;
            // console.log("socket id is changed");
          }
        } else {
          users.push({ email, socketId: socket.id });
        }

        // console.log("user is conntected", socket.id, email);
        socket.on("notification", (data) => {
          console.log("notification", data);
          //   socket.to(id).emit("offer", socket.id, message);
        });
      }
    }
  });
};

export default notification;
