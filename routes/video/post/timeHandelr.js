import { getVideoDurationInSeconds } from "get-video-duration";

const timeHandelr = async (url) => {
  let dur = "0";
  await getVideoDurationInSeconds(url).then((duration) => {
    if (duration < 60) {
      var roundedString = duration.toFixed(0);
      dur = `0.${roundedString}`;
    } else if (duration >= 60 && duration < 3600) {
      const minutes = duration / 60;
      var roundedString = minutes.toFixed(2);
      var rounded = Number(roundedString);
      dur = `${rounded}`;
    } else if (duration >= 3600) {
      const minutes = duration / 120;
      var roundedString = minutes.toFixed(2);
      var rounded = Number(roundedString);
      dur = `${rounded}`;
    }
    console.log(dur);
    return dur;
  });
};

export default timeHandelr;
