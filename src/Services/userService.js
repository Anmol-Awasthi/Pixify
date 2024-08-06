import { supabase } from "../app/lib/Supabase";

export const getUserData = async (userId) => {
    try{
        const {data, error} = await supabase
        .from("users")
        .select()
        .eq("id", userId)
        .single();

        if(error){
            return {success: false, msg: error.message};
        }
        console.log("Got Data: ", data);
        return {success: true, data};
    }
    catch(error){
        console.log("Got Error: ", error.message);
        return {success: false, msg: error.message};
    }
}