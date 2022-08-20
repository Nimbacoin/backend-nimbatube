import webrtc from "wrtc";

const watchStream = (io, socket, liveStreamers) => {
  socket.on("join-watch-stream", async ({ body, roomId }) => {
    console.log("here");
    const streamFilter = liveStreamers.filter(
      (stream) => stream.roomId === roomId
    );
    console.log(streamFilter);

    const stream = streamFilter[streamFilter.length - 1];
    if (stream) {
      const senderStream = stream.senderStream;
      const peer = new webrtc.RTCPeerConnection({
        iceServers: [
          {
            urls: "stun:stun.stunprotocol.org",
          },
        ],
      });
      const desc = new webrtc.RTCSessionDescription(body.sdp);
      await peer.setRemoteDescription(desc);
      senderStream
        .getTracks()
        .forEach((track) => peer.addTrack(track, senderStream));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      const data = {
        sdp: peer.localDescription,
      };
      console.log("sent");
      socket.emit("start-watching-stream", data);
    }
  });
};

export default watchStream;
