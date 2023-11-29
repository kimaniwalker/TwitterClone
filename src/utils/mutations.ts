import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getMessagesByChatIdQueryKey, useUserProfileQueryKey } from "./queries";
import {
  createNewMessage,
  updateChatsById,
  updateUserProfile,
} from "./fetchers";
import { Circles, MessageInsertProps, UserUpdateData } from "./types";
import useUserSession from "@/hooks/useUserSession";

export const useMutationUpdateUserProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserUpdateData) => updateUserProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: useUserProfileQueryKey });
    },
  });
};

export const useMutationUpdateChatById = () => {
  const queryClient = useQueryClient();
  const { session } = useUserSession();

  let inputData: Circles;

  return useMutation({
    mutationFn: (data: Circles) => {
      inputData = data;
      return updateChatsById(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getMessagesByChatIdQueryKey(session?.user.id, inputData.id),
      });
    },
  });
};

export const useMutationNewMessage = () => {
  const queryClient = useQueryClient();
  let insertData: MessageInsertProps;

  return useMutation({
    mutationFn: (message: MessageInsertProps) => {
      insertData = message;
      console.log({ insertData });
      return createNewMessage(message);
    },
    onSuccess: (variables) => {
      queryClient.invalidateQueries({
        queryKey: getMessagesByChatIdQueryKey(
          variables?.user_id,
          variables?.chat_id!
        ),
      });
    },
  });
};
