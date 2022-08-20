import webrtc from "wrtc";

const createLiveStream = async (req, res, allStreams) => {
  const body = req.body;

  const peer = new webrtc.RTCPeerConnection({
    iceServers: [
      {
        urls: "stun:stun.stunprotocol.org",
      },
    ],
  });
  peer.ontrack = (e) => handleTrackEvent(e, peer, body.roomId);

  const desc = new webrtc.RTCSessionDescription(body.sdp.sdp);
  await peer.setRemoteDescription(desc);
  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);
  const payload = {
    sdp: peer.localDescription,
  };

  res.json(payload);
  function handleTrackEvent(e, peer, roomId) {
    const filterd = allStreams.filter((strm) => strm.roomId === "12345");
    if (filterd.length) {
      objIndex = allStreams.findIndex((obj) => obj.roomId === "12345");
      allStreams[objIndex].mediaStream = e.streams[0];
    } else {
      allStreams.push({ mediaStream: e.streams[0], roomId: "12345" });
    }
    console.log(allStreams);
  }
};
export default createLiveStream;
