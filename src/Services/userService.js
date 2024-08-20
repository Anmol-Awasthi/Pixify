import { supabase } from "../app/lib/Supabase";

export const getUserData = async (userId) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, email, address, bio, created_at, image, phoneNumber")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user data:", error);
      return { success: false, msg: error.message };
    }

    // console.log("Got Data: ", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error:", error.message);
    return { success: false, msg: error.message };
  }
};
export const updateUserData = async (userId, data) => {
  try {
    const { error } = await supabase
      .from("users")
      .update(data)
      .eq("id", userId);

    if (error) {
      console.error("Error updating user data:", error);
      return { success: false, msg: error.message };
    }

    console.log("Updated Data: ", data);
    return { success: true };
  } catch (error) {
    console.error("Error:", error.message);
    return { success: false, msg: error.message };
  }
};
