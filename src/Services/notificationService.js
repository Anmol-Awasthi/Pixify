import { supabase } from "../app/lib/Supabase";

export const createNotification = async (notification) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert(notification)
      .select()
      .single();

    if (error) {
      console.log("Notification error : ", error);
      return { success: false, msg: "Failed to notify. Please try again." };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("Notification error : ", error);
    return { success: false, msg: "Failed to notify. Please try again." };
  }
};

export const notificationDetails = async (receiverId) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select(
        `*, sender: senderId(id, name, image)`
      )
      .eq("receiverId", receiverId)
      .order("created_at", {ascending: false})
    if (error) {
      console.log("Fetch Notification details error: ", error);
      return {
        success: false,
        msg: "Failed to fetch Notification details. Please try again.",
      };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("Fetch Notification details error: ", error);
    return {
      success: false,
      msg: "Failed to fetch notification details. Please try again.",
    };
  }
};
