import { IDM, IChat } from "@typings/db";
import React, { useCallback, forwardRef, MutableRefObject, FC } from "react";
import gravatar from "gravatar";

interface Props {
  chatSections: { [key: string]: (IDM | IChat)[] };
  myId: number;
}

const ChatList: FC<Props> = ({ chatSections, myId }) => {
  return (
    <>
      {Object.entries(chatSections).map(([date, chats], idx) => {
        return (
          <div key={`chatwrap--${idx}`}>
            {chats.map((chat, idx) => {
              return (
                <div
                  key={`chatlist-${chat.id}-${idx}`}
                  className={
                    chat.SenderId === myId
                      ? "chat-balloon me"
                      : "chat-balloon other"
                  }
                >
                  <div className="in-a-row profile-wrap">
                    <div className="profile-img">
                      <img
                        src={gravatar.url(`${chat.Sender?.email}`, {
                          s: "70px",
                          d: "monsterid",
                        })}
                        alt={`${chat.Sender?.nickname}`}
                      />
                    </div>
                    <span className="profile-username">
                      {chat.Sender?.nickname}
                    </span>
                  </div>
                  <p>{chat.content}</p>
                </div>
              );
            })}
          </div>
        );
      })}

      {/*  <div className="div-line">
            <strong>2022.08.15</strong>
          </div> */}
    </>
  );
};

export default ChatList;
