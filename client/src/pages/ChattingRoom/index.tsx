import React, { useCallback, useEffect, useRef } from "react";
import { IoIosSend } from "react-icons/io";
import { useParams } from "react-router";
import useInput from "@hooks/useInput";
import axios, { AxiosError } from "axios";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { IChat, IDM, IUser, IWorkspace } from "@typings/db";
import fetcher from "@utils/fetcher";
import makeSection from "@utils/makeSection";
import ChatList from "@components/ChatList";
import useSocket from "@hooks/useSocket";

const ChattingRoom = () => {
  const { workspace, id } = useParams<{
    workspace?: string;
    id?: string;
  }>();

  const queryClient = useQueryClient();
  const { data: userData } = useQuery(
    ["workspace", workspace, "users", id],
    () => {
      if (!id) return null;
      return fetcher({
        queryKey: `http://localhost:3095/api/workspaces/${workspace}/users/${id}`,
      });
    }
  );

  const { data: myData } = useQuery("users", () =>
    fetcher({ queryKey: "http://localhost:3095/api/users" })
  );
  const [chat, onChangeChat, setChat] = useInput("");
  const { data: channelChatData } = useInfiniteQuery<IChat[]>([]);
  const {
    data: chatData,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<IDM[]>(
    ["workspace", workspace, "dm", id, "chat"],
    ({ pageParam = 0 }) =>
      fetcher({
        queryKey: `http://localhost:3095/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=${
          pageParam + 1
        }`,
      }),
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length === 0) return;
        return pages.length;
      },
    }
  );
  const [socket] = useSocket(workspace);
  const isEmpty = chatData?.pages ? chatData?.pages[0]?.length === 0 : false;
  const isReachingEnd =
    isEmpty ||
    (chatData && chatData?.pages[chatData?.pages.length - 1]?.length < 20) ||
    false;

  const mutation = useMutation<IDM, AxiosError, { content: string }>(
    ["workspace", workspace, "dm", id, "chat"],
    () =>
      fetcher({
        queryKey: `http://localhost:3095/api/workspaces/${workspace}/dms/${id}/chats`,
      }),
    {
      onMutate(mutateData) {
        queryClient.setQueryData<InfiniteData<IDM[]>>(
          ["workspace", workspace, "dm", id, "chat"],
          (data) => {
            const newPages = data?.pages.slice() || [];
            newPages[0].unshift({
              id: (data?.pages[0][0]?.id || 0) + 1,
              content: mutateData.content,
              SenderId: myData.id,
              Sender: myData,
              ReceiverId: userData.id,
              Receiver: userData,
              createdAt: new Date(),
            });
            return {
              pageParams: data?.pageParams || [],
              pages: newPages,
            };
          }
        );
        setChat("");
        // scrollbarRef.current?.scrollToBottom();
      },
      onError(error) {
        console.log("ERROR id", id);
        console.error(error);
      },
      onSuccess() {
        queryClient.refetchQueries(["workspace", workspace, "dm", id, "chat"]);
      },
    }
  );
  const onSubmitChatHandler = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (chat?.trim() && chatData) {
        mutation.mutate({ content: chat });
      }
    },
    [chat, chatData, mutation]
  );

  const onMessage = useCallback(
    (data: IDM) => {
      // id는 상대방 아이디
      if (data.SenderId === Number(id) && myData.id !== Number(id)) {
        queryClient.setQueryData<InfiniteData<IDM[]>>(
          ["workspace", workspace, "dm", id, "chat"],
          (prev) => {
            const newPages = prev?.pages.slice() || [];
            newPages[0].unshift(data);
            return {
              pageParams: prev?.pageParams || [],
              pages: newPages,
            };
          }
        );
      }
    },
    [workspace, id, myData.id, queryClient]
  );

  /*   useEffect(() => {
    socket?.on("dm", onMessage);
    return () => {
      socket?.off("dm", onMessage);
    };
  }, [socket, onMessage]); */

  const onKeydownChat = useCallback(
    (e: any) => {
      if (e.key === "Enter") {
        if (!e.shiftKey) {
          e.preventDefault();
          onSubmitChatHandler(e);
        }
      }
    },
    [chat, onSubmitChatHandler]
  );

  /* 
  if (!userData || !myData) {
    return null;
  } */

  const chatSections = makeSection(
    chatData ? chatData.pages.flat().reverse() : []
  );

  return (
    <>
      <div className="chat-area">
        <div className="balloons-wrap scrollbar">
          <ChatList myId={myData.id} chatSections={chatSections} />
        </div>
        <div className="chatbox-wrapper">
          <form action="" onSubmit={onSubmitChatHandler} className="in-a-row">
            <textarea
              name=""
              id=""
              rows={1}
              value={chat}
              onChange={onChangeChat}
              onKeyDown={onKeydownChat}
            ></textarea>
            <button type="submit">
              <IoIosSend size="20" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChattingRoom;
