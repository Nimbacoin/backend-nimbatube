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
    allStreams.push({ mediaStream: e.streams[0], roomId: roomId });
  }
};
export default createLiveStream;
