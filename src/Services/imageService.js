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
  if (filepath && supaBaseUrl) {
    return `${supaBaseUrl}/storage/v1/object/public/uploads/${filepath}`;
  }
  console.log("Unable to generate URL. filepath:", filepath, "supaBaseUrl:", supaBaseUrl);
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

export const getLocalFilePath = filePath => {
  if (!filePath) return null;
  let fileName = filePath.includes('/') ? filePath.split("/").pop() : filePath;
  return `${FileSystem.documentDirectory}${fileName}`;
};
  export const downloadFile = async (filePath) => {
    try {
      const fullUrl = getSupabaseFileUrl(filePath);
      if (!fullUrl) {
        console.log("Unable to generate full URL");
        return null;
      }
      const localPath = getLocalFilePath(filePath);
      if (!localPath) {
        console.log("Unable to generate local file path");
        return null;
      }
      const { uri } = await FileSystem.downloadAsync(fullUrl, localPath);
      console.log("File downloaded successfully to:", uri);
      return uri;
    } catch (error) {
      console.log("Error downloading file: ", error);
      return null;
    }
  };