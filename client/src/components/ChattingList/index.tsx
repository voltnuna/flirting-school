import useSocket from "@hooks/useSocket";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ChattingList = () => {
  const [onlineList, setOnlineList] = useState<number[]>([]);
  const { workspace } = useParams<{
    workspace?: string;
  }>();
  const [socket, disconnect] = useSocket(workspace);

  useEffect(() => {
    socket?.on("onlineList ", (data: number[]) => {
      setOnlineList(data);
    });
    return () => {
      socket?.off("onlineList");
    };
  }, [socket]);

  return <></>;
};

export default ChattingList;
