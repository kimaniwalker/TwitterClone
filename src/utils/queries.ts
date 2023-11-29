import { useQuery } from "@tanstack/react-query";
import {
  getAvatarUrls,
  getChats,
  getMessages,
  getUserProfile,
} from "./fetchers";
import useUserSession from "@/hooks/useUserSession";

export const useUserProfileQueryKey = ["user_profile"];

export const useQueryUserProfile = () => {
  const { session } = useUserSession();
  return useQuery({
    queryKey: useUserProfileQueryKey,
    queryFn: () => getUserProfile({ session }),
    enabled: Boolean(session),
  });
};

const getUserChatsQueryKey = (user_id: string | undefined) =>
  [MessagesByChatId, user_id] as const;

export type UserChatsKey = ReturnType<typeof getUserChatsQueryKey>;

export const useQueryGetUserChats = () => {
  const { session } = useUserSession();
  const user_id = session?.user.id;
  return useQuery({
    queryKey: getUserChatsQueryKey(user_id),
    queryFn: () => getChats({ user_id }),
    enabled: Boolean(user_id),
  });
};
useQueryGetUserChats.getKey = getUserChatsQueryKey;
useQueryGetUserChats.fetcher = getChats;

export const MessagesByChatId = "user_messages";

export const getMessagesByChatIdQueryKey = (
  user_id: string | undefined,
  chat_id: string
) => [MessagesByChatId, user_id, chat_id] as const;

export type MessagesByChatIdKey = ReturnType<
  typeof getMessagesByChatIdQueryKey
>;

export const useQueryGetMessagesByChatId = (chat_id: string) => {
  const { session } = useUserSession();
  const user_id = session?.user.id;
  return useQuery({
    queryKey: getMessagesByChatIdQueryKey(user_id, chat_id),
    queryFn: () => getMessages({ user_id, chat_id }),
    enabled: Boolean(user_id && chat_id),
  });
};
useQueryGetMessagesByChatId.getKey = getMessagesByChatIdQueryKey;
useQueryGetMessagesByChatId.fetcher = getMessages;

export const ChatAvatars = "chat_avatars";

export const getChatAvatarsQueryKey = (user_list: string[], chat_id: string) =>
  [ChatAvatars, user_list, chat_id] as const;

export type ChatAvatarsKey = ReturnType<typeof getChatAvatarsQueryKey>;

export const useQueryGetChatAvatars = (
  user_list: string[],
  chat_id: string
) => {
  return useQuery({
    queryKey: getChatAvatarsQueryKey(user_list, chat_id),
    queryFn: () => getAvatarUrls(user_list),
    enabled: Boolean(user_list && chat_id),
  });
};
useQueryGetChatAvatars.getKey = getChatAvatarsQueryKey;
useQueryGetChatAvatars.fetcher = getAvatarUrls;
