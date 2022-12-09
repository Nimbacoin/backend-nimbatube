import webrtc from "wrtc";

const makeStream = (io, socket, liveStreamers) => {
  socket.on("start-broadcasting-stream", async ({ body, roomId }) => {
    const peer = new webrtc.RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.stunprotocol.org",
        },
      ],
    });
    peer.ontrack = (e) => handleTrackEvent(e, peer);
    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const data = {
      sdp: peer.localDescription,
    };
    socket.emit("broadcasting-stream", data);
    function handleTrackEvent(e, peer) {
      liveStreamers.push({ senderStream: e.streams[0], roomId });
    }
  });
};

export default makeStream;
