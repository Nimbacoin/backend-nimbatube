import express from "express";
import User from "../../../../db/schema/user.js";
import ChanelModal from "../../../../db/schema/chanel.js";
import { cloudinary } from "../../../../utils/Cloudinary/Cloudinary.js";
const uploadChanelImages = async (imageStr) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(imageStr, {
      upload_preset: "profiles_nimbatube",
    });
    return uploadResponse;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export default uploadChanelImages;
