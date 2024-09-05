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
      .select(`*, user: users (id, name, image), postLikes (*), comments (count)`)
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
export const fetchPostDetails = async (postId) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(`*, user: users (id, name, image), postLikes (*), comments (*, user: users (id, name, image))`)
      .eq("id", postId)
      .order("created_at", { ascending: false, foreignTable: "comments" })
      .single();
    if (error) {
      console.log("Fetch post details error: ", error);
      return {
        success: false,
        msg: "Failed to fetch post details. Please try again.",
      };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("Fetch post details error: ", error);
    return {
      success: false,
      msg: "Failed to fetch post details. Please try again.",
    };
  }
};
export const createPostLike = async (LikeData) => {
  try {
    const { data, error } = await supabase
      .from("postLikes")
      .insert(LikeData)
      .select()
      .single();

    if (error) {
      console.log("Like Post error : ", error);
      return { success: false, msg: "Failed to like post. Please try again." };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("Like Post error : ", error);
    return { success: false, msg: "Failed to like post. Please try again." };
  }
};
export const removePostLike = async (postId, userId) => {
  try {
    const { error } = await supabase
      .from("postLikes")
      .delete()
      .eq("userId", userId)
      .eq("postId", postId);
    if (error) {
      console.log("Unlike Post error : ", error);
      return {
        success: false,
        msg: "Failed to unlike post. Please try again.",
      };
    }

    return { success: true };
  } catch (error) {
    console.log("Unlike Post error : ", error);
    return { success: false, msg: "Failed to unlike post. Please try again." };
  }
};
export const createComment = async (commentData) => {
  try {
    const { data, error } = await supabase
      .from("comments")
      .insert(commentData)
      .select()
      .single();

    if (error) {
      console.log("Comment Post error : ", error);
      return {
        success: false,
        msg: "Failed to create comment. Please try again.",
      };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("Comment Post error : ", error);
    return {
      success: false,
      msg: "Failed to create comment. Please try again.",
    };
  }
};
export const removeComment = async (commentId) => {
  try {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId)
    if (error) {
      console.log("Remove Comment Error : ", error);
      return {
        success: false,
        msg: "Failed to delete comment. Please try again.",
      };
    }

    return { success: true, data: {commentId} };
  } catch (error) {
    console.log("Remove Comment error : ", error);
    return { success: false, msg: "Failed to delete comment. Please try again." };
  }
};
export const removePost = async (postId) => {
  try {
    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId)
    if (error) {
      console.log("Remove Post Error : ", error);
      return {
        success: false,
        msg: "Failed to delete post. Please try again.",
      };
    }

    return { success: true, data: {postId} };
  } catch (error) {
    console.log("Remove post error : ", error);
    return { success: false, msg: "Failed to delete post. Please try again." };
  }
};
