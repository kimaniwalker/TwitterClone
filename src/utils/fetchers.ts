import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import { Circles, MessageInsertProps, UserUpdateData } from "./types";
import { getData, storeData } from "./localStorage";
import { Recording } from "expo-av/build/Audio";

export async function getUserProfile({ session }: { session: Session | null }) {
  try {
    if (!session?.user) throw new Error("No user on the session!");

    let { data, error, status } = await supabase
      .from("profiles")
      .select()
      .eq("id", session.user.id)
      .single();
    if (error && status !== 406) {
      throw error;
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
}

export async function updateUserProfile(data: UserUpdateData) {
  console.log({ data });
  try {
    let { data: updatedData, error } = await supabase
      .from("profiles")
      .upsert(data);
    console.log({ updatedData });
    if (error) {
      throw error;
    }
    return updatedData;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
}

export async function updateChatsById(data: Circles) {
  console.log({ data });
  try {
    let { data: updatedData, error } = await supabase
      .from("chats")
      .upsert(data)
      .eq("id", data.user_id)
      .eq("chat_id", data.id);
    console.log({ updatedData });
    if (error) {
      throw error;
    }
    return updatedData;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
}

export async function getChats({ user_id }: { user_id: string | undefined }) {
  try {
    if (!user_id) throw new Error("No user on the session!");

    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", user_id);
    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
}
export async function getMessages({
  user_id,
  chat_id,
}: {
  user_id: string | undefined;
  chat_id: string;
}) {
  try {
    if (!user_id) throw new Error("No user on the session!");

    let { data, error, status } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chat_id);
    if (error && status !== 406) {
      throw error;
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
}

export async function getAvatarUrls(user_list: string[]) {
  try {
    console.log("getting urls");
    const { data, error } = await supabase
      .from("profiles")
      .select("avatar_url,id")
      .in("id", user_list);
    console.log({ data });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
}

export async function createNewMessage(message: MessageInsertProps) {
  try {
    const { data, error } = await supabase.from("messages").insert([message]);

    if (error) {
      throw error;
    }

    return message;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
}

export async function uploadCloudinaryAsset(uri: string) {
  const cleanFileName = uri?.split("/").pop(); // Extract the filename from the full path
  const sanitizedFileName = cleanFileName?.replace(/[^a-z0-9_.-]/gi, ""); // Remove invalid characters
  const sound = {
    uri,
    type: "audio",
    name: sanitizedFileName,
  };

  const formData = new FormData();
  // @ts-ignore
  formData.append("file", sound);
  formData.append("upload_preset", "n8iosg9p");
  formData.append("cloud_name", "dnssh6f9x");

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dnssh6f9x/upload",
      {
        method: "post",
        body: formData,
      }
    );
    const data = await res.json();
    console.log({ data });
    if (data.secure_url) {
      return data.secure_url;
    }
  } catch (error) {
    console.log(error);
  }
}
