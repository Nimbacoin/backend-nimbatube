import webrtc from "wrtc";

const joinStream = async (req, res, allStreams) => {
  const body = req.body;
  const peer = new webrtc.RTCPeerConnection({
    iceServers: [
      {
        urls: "stun:stun.stunprotocol.org",
      },
    ],
  });
  const desc = new webrtc.RTCSessionDescription(body.sdp.sdp);
  await peer.setRemoteDescription(desc);
  const streamFiltered = allStreams.filter(
    (strm) => strm.roomId === body.roomId
  );

  const streams = streamFiltered[streamFiltered.length - 1].mediaStream;
  console.log(allStreams);
  streams.getTracks().forEach((track) => peer.addTrack(track, streams));
  const answer = await peer.createAnswer();
  await peer.setLocalDescription(answer);
  const payload = {
    sdp: peer.localDescription,
  };
  res.json(payload);
};
export default joinStream;
