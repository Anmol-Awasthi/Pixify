import { supabase } from "../app/lib/Supabase";
import { uploadImage } from "./imageService";

export const CreateOrUpdatePost = async (post) => {
  try {
    if (post.file && typeof post.file == "object") {
      let isImage = post?.file?.type == "image";
      let folderName = isImage ? "postImages" : "postVideos";

      let fileResult = await uploadImage(folderName, post?.file?.uri, isImage);
      if (fileResult.success) {
        post.file = fileResult.data;
      } else {
        return fileResult;
      }
    }

    const { data, error } = await supabase
      .from("posts")
      .upsert(post)
      .select()
      .single();

    if (error) {
      console.log("Create post error: ", error);
      return {
        success: false,
        msg: "Failed to create post. Please try again.",
      };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("Create post error: ", error);
    return { success: false, msg: "Failed to create post. Please try again." };
  }
};
export const fetchPosts = async (limit = 10) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(`*, user: users (id, name, image)`)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.log("Fetch post error: ", error);
      return { success: false, msg: "Failed to fetch post. Please try again." };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("Fetch post error: ", error);
    return { success: false, msg: "Failed to fetch post. Please try again." };
  }
};
