import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { IChannel, IChat, IDM, IUser, IWorkspace } from "@typings/db";
import fetcher from "@utils/fetcher";
import makeSection from "@utils/makeSection";
import ChatList from "@components/ChatList";
import Scrollbars from "react-custom-scrollbars-2";
import useSocket from "@hooks/useSocket";

const ChannelChat = () => {
  const queryClient = useQueryClient();
  const { workspace, channel } = useParams<{
    workspace: string;
    channel: string;
  }>();
  const { data: myData } = useQuery("user", () =>
    fetcher({ queryKey: "http://localhost:3095/api/users" })
  );
  const [chat, onChangeChat, setChat] = useInput("");
  useEffect(() => {}, []);
  const { data: channelData } = useQuery<IChannel>(
    ["workspace", workspace, "channel", channel, "chat"],
    () =>
      fetcher({
        queryKey: `http://localhost:3095/api/workspaces/${workspace}/channels/${channel}`,
      })
  );
  const { data: chatData } = useInfiniteQuery<IChat[]>(
    ["workspace", workspace, "channel", channel, "chat"],
    ({ pageParam }) =>
      fetcher({
        queryKey: `http://localhost:3095/api/workspaces/${workspace}/channels/${channel}/chats?perPage=20&page=${pageParam +
          1}`,
      }),
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length === 0) return;
        return pages.length;
      },
    }
  );

  const isEmpty = chatData?.pages && chatData?.pages[0]?.length === 0;

  const scrollbarRef = useRef<Scrollbars>(null);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const mutation = useMutation<IDM, AxiosError, { content: string }>(
    ["workspace", workspace, "channel", channel, "chat"],
    () =>
      fetcher({
        queryKey: `http://localhost:3095/api/workspaces/${workspace}/channels/${channel}/chats`,
      }),
    {
      onMutate(mutateData) {
        if (!channelData) return;
        queryClient.setQueryData<InfiniteData<IChat[]>>(
          ["workspace", workspace, "channel", channel, "chat"],
          (data) => {
            const newPages = data?.pages.slice() || [];
            newPages[0].unshift({
              id: (data?.pages[0][0]?.id || 0) + 1,
              content: mutateData.content,
              UserId: myData.id,
              User: myData,
              ChannelId: channelData?.id,
              Channel: channelData,
              createdAt: new Date(),
            });
            return {
              pageParams: data?.pageParams || [],
              pages: newPages,
            };
          }
        );
        setChat("");
        scrollbarRef.current?.scrollToBottom();
      },
      onError(error) {
        console.error(error);
      },
      onSuccess() {
        queryClient.refetchQueries([
          "workspace",
          workspace,
          "channel",
          channel,
          "chat",
        ]);
      },
    }
  );
  // 0초 A: 안녕~(optimistic UI)
  // 1초 B: 안녕~
  // 2초 A: 안녕~(실제 서버)
  const onSubmitChatHandler = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (chat?.trim() && chatData && channelData) {
        mutation.mutate({ content: chat });
      }
    },
    [chat, chatData, channelData, mutation]
  );

  const onMessage = useCallback(
    (data: IChat) => {
      // id는 상대방 아이디
      if (
        data.Channel.name === channel &&
        (data.content.startsWith("uploads\\") || data.UserId !== myData?.id)
      ) {
        queryClient.setQueryData<InfiniteData<IChat[]>>(
          ["workspace", workspace, "channel", channel, "chat"],
          (prev) => {
            const newPages = prev?.pages.slice() || [];
            newPages[0].unshift(data);
            return {
              pageParams: prev?.pageParams || [],
              pages: newPages,
            };
          }
        );
        if (scrollbarRef.current) {
          if (
            scrollbarRef.current.getScrollHeight() <
            scrollbarRef.current.getClientHeight() +
              scrollbarRef.current.getScrollTop() +
              150
          ) {
            console.log("scrollToBottom!", scrollbarRef.current?.getValues());
            setTimeout(() => {
              scrollbarRef.current?.scrollToBottom();
            }, 50);
          }
        }
      }
    },
    [channel, myData, queryClient, workspace]
  );

  const onClickInviteChannel = useCallback(() => {
    setShowInviteChannelModal(true);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowInviteChannelModal(false);
  }, []);

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

  const chatSections = makeSection(
    chatData ? chatData.pages.flat().reverse() : []
  );

  return (
    <>
      <div className="chat-area">
        {myData && chatData && (
          <div className="balloons-wrap scrollbar">
            <ChatList myId={myData?.id} chatSections={chatSections} />
          </div>
        )}
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

export default ChannelChat;
