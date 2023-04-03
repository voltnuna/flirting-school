import React, { FC, useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import Header from "@components/Header";
import ChatterList from "@components/ChatterList";
import { useQuery, useQueryClient } from "react-query";
import { IUser } from "@typings/db";
import fetcher from "@utils/fetcher";
import useSocket from "@hooks/useSocket";
import gravatar from "gravatar";
import axios from "axios";
import FormModal from "@components/FormModal";
import useInput from "@hooks/useInput";

interface Props {
  wsMembersData?: IUser[];
}

const ChannelHome: FC<Props> = ({ wsMembersData }) => {
  const { workspace } = useParams<{
    workspace?: string;
  }>();

  const queryClient = useQueryClient();
  const { data: userData } = useQuery("users", () =>
    fetcher({ queryKey: "http://localhost:3095/api/users" })
  );

  const { data: wsMemeber } = useQuery("member", () =>
    fetcher({
      queryKey: `http://localhost:3095/api/workspaces/${workspace}/members`,
    })
  );

  const [showInviteWsModal, setShowInviteWsModal] = useState(false);
  const [newMember, onChangeNewMember, setNewMember] = useInput("");
  const [memberEmail, setMemberEmail] = useState("");

  const onOpenModalHandler = useCallback(
    (email: string, workspaceUrl: string) => {
      setShowInviteWsModal(true);
      setMemberEmail(email);
      onInviteWsHandler(email);
    },
    [setShowInviteWsModal]
  );

  const onCloseModalHandler = useCallback(() => {
    setShowInviteWsModal(false);
  }, [setShowInviteWsModal]);

  const onInviteHandler = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }, []);

  const onInviteWsHandler = useCallback((workspaceUrl: string) => {
    axios
      .post(
        `http://localhost:3095/api/workspaces/${workspaceUrl}/members`,
        { email: memberEmail },
        { withCredentials: true }
      )
      .then(() => {
        queryClient.refetchQueries("member");
      })
      .catch((error) => {
        console.dir(error.response?.data);
      });
  }, []);

  return <></>;
};

export default ChannelHome;
