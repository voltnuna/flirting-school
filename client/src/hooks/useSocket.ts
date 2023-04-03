import io from "socket.io-client";
import { useCallback } from "react";
import axios from "axios";
const baseUrl = "http://localhost:3095";

const sockets: { [key: string]: SocketIOClient.Socket } = {};

const useSocket = (
  workspace?: string
): [SocketIOClient.Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, [workspace]);

  if (!workspace) return [undefined, disconnect];

  if (!sockets[workspace]) {
    sockets[workspace] = io.connect(`${baseUrl}/ws-${workspace}`, {
      transports: ["websocket"],
    });
  }

  sockets[workspace].emit("hello", "world"); // hello라는 이벤트 이름으로 world라는 데이터 보냄
  sockets[workspace].on("message", (data: any) => {
    console.log(data);
  }); // message라는 이벤트 이름으로 data를 받는 callback 함수가 옴
  //emit으로 이벤트 보내고 on으로 이벤트 받음, 이벤트 명 같을 때만 받음

  return [sockets[workspace], disconnect];
};

export default useSocket;
