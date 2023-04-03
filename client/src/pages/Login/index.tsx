import React, { useCallback, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import useInput from "@hooks/useInput";
import InputForm from "@components/InputForm";
import AlertModal from "@components/AlertModal";
import axios, { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import fetcher from "@utils/fetcher";

import { IUser } from "@typings/db";

const Login = () => {
  const queryClient = useQueryClient();

  const [email, onChangeEamil] = useInput("");
  const [password, onChangePassword] = useInput("");
  const [showPwModal, setShowPwModal] = useState(false);
  const [showAlertModal, setshowAlertModal] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const {
    isLoading,
    isSuccess,
    status,
    isError,
    data: userData,
    error,
  } = useQuery("users", () =>
    fetcher({ queryKey: "http://localhost:3095/api/users" })
  );

  const mutation = useMutation<
    IUser,
    AxiosError,
    { email: string; password: string }
  >(
    "users",
    (userData) =>
      axios
        .post("http://localhost:3095/api/users/login", userData, {
          withCredentials: true,
        })
        .then((response) => response.data),
    {
      onMutate() {
        //       setLogInError(false);
      },
      onSuccess() {
        queryClient.refetchQueries("users");
      },
      onError(error) {
        // setLogInError(error.response?.data?.code === 401);
      },
    }
  );

  const onFormCheckHandler = useCallback(() => {
    if (email.length === 0) {
      setAlertMsg("이메일");
      setshowAlertModal(true);
      return false;
    } else if (password.length === 0) {
      setAlertMsg("비밀번호");
      setshowAlertModal(true);
      return false;
    }
    return true;
  }, [email, password, setshowAlertModal, setAlertMsg]);

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!onFormCheckHandler()) return;
      mutation.mutate({ email, password });
    },
    [email, password, mutation, onFormCheckHandler]
  );

  const onShowModal = useCallback(() => {
    setShowPwModal(true);
  }, [setShowPwModal]);

  const onCloseModalHandler = useCallback(() => {
    setShowPwModal(false);
    setshowAlertModal(false);
  }, [setShowPwModal]);

  if (isLoading) {
    return <div className="spinner">Loading...</div>;
  }

  if (userData) {
    return <Navigate to="/workspace" />;
  }

  return (
    <>
      <div className="center-item">
        <div className="login--container">
          <div className="center-txt title">
            <h2>돌아오신 것을 환영해요!</h2>
            <h3>다시 만나다니 너무 반가워요!</h3>
          </div>
          <form onSubmit={onSubmit}>
            <InputForm
              id="loginEmail"
              inputType="email"
              labelName="이메일"
              value={email}
              placeholder="이메일을 입력하세요."
              className="fullsize"
              onChangeHandler={onChangeEamil}
            />
            <InputForm
              id="signupPassword"
              inputType="password"
              labelName="비밀번호"
              value={password}
              placeholder="비밀번호를 입력하세요."
              className="fullsize"
              onChangeHandler={onChangePassword}
            />
            <p className="guide-msg">
              <button type="button" className="link" onClick={onShowModal}>
                비밀번호를 잊으셨나요?
              </button>
            </p>
            <div style={{ marginTop: "2rem" }}>
              <button type="submit" className="fullsize">
                로그인
              </button>
              <p className="guide-msg">
                계정이 필요한가요? <Link to="/signup">가입하기</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      {/* 비밀번호 찾기 모달 */}
      <AlertModal
        title="이메일 전송 완료"
        footType="confirm"
        show={showPwModal}
        content={`비밀번호 변경 방법을 ${email}(으)로 보냈어요. 받은 편지함 또는 스팸함을 확인해주세요.`}
        onCloseModalHandler={onCloseModalHandler}
      />

      {/* 입력 확인 모달 */}
      <AlertModal
        title="알림"
        footType="confirm"
        show={showAlertModal}
        content={`${alertMsg} (을)를 입력해주세요. `}
        onCloseModalHandler={onCloseModalHandler}
      />
    </>
  );
};

export default Login;
