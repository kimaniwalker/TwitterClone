import type { StackScreenProps } from "@react-navigation/stack";
import type { StackNavigationProp } from "@react-navigation/stack";

export interface UserUpdateData {
  id: string;
  username?: string;
  bio?: string;
  avatar_url?: string;
  full_name?: string;
  updated_at?: string;
  dob?: string;
  gender?: string;
  current_location?: string;
  interest?: string;
}

export interface Circles {
  id: string;
  user_id: string;
  created_at: string;
  members: string;
  name: string;
}

export type MessageInsertProps = Omit<Messages, "created_at" | "id">;

export interface MessageType {
  type: "text" | "voice" | "video" | "image";
  content: string;
}
export interface Messages {
  id: string;
  created_at: string;
  delivered: string;
  message: MessageType;
  chat_id: string;
  user_id: string;
}

export type RootStackParamList = {
  Chats: undefined;
  Messages: {
    id: string;
    members: string;
  };
  CreateNewChat: undefined;
};

export type ChatScreenProps = StackScreenProps<
  RootStackParamList,
  "Chats",
  undefined
>;
export type MessageScreenProps = StackScreenProps<
  RootStackParamList,
  "Messages"
>;

export type MessagesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Messages"
>;

export type CreateNewChatScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CreateNewChat"
>;
