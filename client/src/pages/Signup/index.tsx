import React, { useCallback, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useInput from "@hooks/useInput";
import AlertModal from "@components/AlertModal";
import InputForm from "@components/InputForm";
import fetcher from "@utils/fetcher";
import { IUser } from "@typings/db";
import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

const Signup = () => {
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
  const navi = useNavigate();

  const [email, onChangeEamil] = useInput("");
  const [password, onChangePassword] = useInput("");
  const [passwordCheck, onChangePasswordChk, setPasswordCheck] = useInput("");

  const [nickname, onChangeNickname] = useInput("");
  const [showAlertModal, setshowAlertModal] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [mismatchError, setMismatchError] = useState(false);
  const [signUpError, setSignUpError] = useState("");
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const onShowModal = useCallback(() => {
    setshowAlertModal(true);
  }, [setshowAlertModal]);

  const onCloseModalHandler = useCallback(() => {
    setshowAlertModal(false);
  }, [setshowAlertModal]);

  const onChangePasswordCheck = useCallback(
    (e: any) => {
      setPasswordCheck(e.target.value);
      setMismatchError(e.target.value !== password);
    },
    [password, setPasswordCheck]
  );

  const onFormCheckHandler = useCallback(() => {
    if (email.length === 0) {
      setAlertMsg("이메일");
      onShowModal();
      return false;
    } else if (nickname.length === 0) {
      setAlertMsg("닉네임");
      onShowModal();
      return false;
    } else if (password.length === 0) {
      setAlertMsg("비밀번호");
      onShowModal();
      return false;
    } else if (passwordCheck.length === 0) {
      setAlertMsg("비밀번호 확인");
      onShowModal();
      return false;
    }
    return true;
  }, [email, password, nickname, passwordCheck, setAlertMsg, onShowModal]);

  const mutation = useMutation<
    IUser,
    AxiosError,
    { email: string; password: string; nickname: string }
  >(
    "users",
    (data) =>
      axios
        .post("http://localhost:3095/api/users", data)
        .then((response) => {
          toast("Default Notification !");
          return response.data;
        })
        .catch((error) => {
          console.dir(error.response.data);
          toast.error(error.response?.data, {
            position: "bottom-center",
            className: "toast-pop",
          });
        }),
    {
      onMutate() {
        setSignUpError("");
        setSignUpSuccess(false);
      },
      onSuccess() {
        return navi("/login");
      },
      onError(error) {
        setSignUpError(error.response?.data);
        toast.error(error.response?.data, {
          position: "bottom-center",
          className: "toast-pop",
        });
      },
    }
  );

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!onFormCheckHandler()) return;
      if (!mismatchError && nickname)
        console.log(mutation.mutate({ email, nickname, password }));
    },
    [email, password, nickname, mismatchError, mutation, onFormCheckHandler]
  );

  if (isLoading) {
    return <div className="spinner">Loading...</div>;
  }

  if (userData) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <div className="center-item">
        <div className="signup--container">
          <div className="center-txt title">
            <h2 className="">계정 만들기</h2>
          </div>
          <form onSubmit={onSubmit}>
            <InputForm
              id="signupEmail"
              inputType="email"
              labelName="이메일"
              value={email}
              placeholder="이메일을 입력하세요."
              className="fullsize"
              onChangeHandler={onChangeEamil}
            />
            <InputForm
              id="signupNickname"
              inputType="text"
              labelName="닉네임"
              value={nickname}
              placeholder="닉네임을 입력하세요."
              className="fullsize"
              onChangeHandler={onChangeNickname}
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
            <InputForm
              id="signupPasswordChk"
              inputType="password"
              labelName="비밀번호 확인"
              value={passwordCheck}
              placeholder="비밀번호를 입력하세요."
              className="fullsize"
              onChangeHandler={onChangePasswordChk}
            />
            <div style={{ marginTop: "2rem" }}>
              <button type="submit" className="fullsize">
                계속하기
              </button>
              <p className="guide-msg">
                <Link to="/login"> 이미 계정이 있으신가요? </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      {/* 입력 확인 모달 */}
      <AlertModal
        title="알림"
        footType="confirm"
        show={showAlertModal}
        content={`${alertMsg} (을)를 입력해주세요.`}
        onCloseModalHandler={onCloseModalHandler}
      />
    </>
  );
};

export default Signup;
