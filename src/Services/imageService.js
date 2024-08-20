import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import { supabase } from "../app/lib/Supabase";
import { supaBaseUrl } from "../helpers/common";

export const getUserImageSrc = (imagePath) => {
  if (imagePath) {
    return getSupabaseFileUrl(imagePath);
  } else {
    return require("../../assets/userProfile.png");
  }
};

export const getSupabaseFileUrl = (filepath) => {
  if (filepath) {
    return `${supaBaseUrl}/storage/v1/object/public/uploads/${filepath}`;
  }
  return null;
};

export const uploadImage = async (folderName, fileUri, isImage = true) => {
  try {
    let fileName = getFilePath(folderName, isImage);
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    let imageData = decode(fileBase64);

    let { data, error } = await supabase.storage
      .from("uploads")
      .upload(fileName, imageData, {
        contentType: isImage ? "image/*" : "video/*",
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.log("Error uploading image: ", error);
      return {
        success: false,
        msg: "Error uploading image. Please try again.",
      };
    }

    console.log("Image uploaded successfully: ", data);
    return { success: true, data: data.path };
  } catch (error) {
    console.log("Error uploading image: ", error);
    return { success: false, msg: "Error uploading image. Please try again." };
  }
};

const getFilePath = (folderName, isImage) => {
  return `${folderName}/${new Date().getTime()}${isImage ? ".png" : ".mp4"}`;
};
