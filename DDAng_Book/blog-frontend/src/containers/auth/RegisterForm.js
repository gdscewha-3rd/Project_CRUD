import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeField, initializeForm, register } from "../../modules/auth";
import AuthForm from "../../components/auth/AuthForm";
import { check } from "../../modules/user";
import { withRouter } from "react-router-dom";

const RegisterForm = ({ history }) => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { form, auth, authError, user } = useSelector(({ auth, user }) => ({
    form: auth.register,
    auth: auth.auth,
    authError: auth.authError,
    user: user.user,
  }));

  //input 변경 이벤트 핸들러 함수
  const onChange = (e) => {
    const { value, name } = e.target;
    dispatch(
      changeField({
        form: "register",
        key: name,
        value,
      }),
    );
  };

  //form 제출 이벤트 핸들러 함수
  const onSubmit = (e) => {
    e.preventDefault();
    const { username, password, passwordConfirm } = form;
    //하나라도 빈 경우
    if ([username, password, passwordConfirm].includes("")) {
      setError("빈칸을 모두 입력하시오");
      return;
    }
    //비밀번호가 일치하지 않음
    if (password !== passwordConfirm) {
      setError("비밀번호 일치하지 않음");
      changeField({ from: "register", key: "password", value: "" });
      changeField({ form: "register", key: "passwordConfirm", value: "" });
      return;
    }
    dispatch(register({ username, password }));
  };

  //컴포넌트가 처음 랜더링될 때 form 초기화
  useEffect(() => {
    dispatch(initializeForm("register"));
  }, [dispatch]);

  useEffect(() => {
    if (authError) {
      //계정명 이미 존재함
      if (authError.response.status === 409) {
        setError("이미 존재하는 계정");
        return;
      }
      //기타 이유
      setError("회원가입 실패");
      return;
    }
    if (auth) {
      console.log("회원가입 성공");
      console.log(auth);
      dispatch(check());
    }
  }, [auth, authError, dispatch]);

  //user 값 설정되었는지 확인
  useEffect(() => {
    if (user) {
      console.log("CHECK API 성공");
      console.log(user);
      history.push("/"); //홈 화면으로 이동
      try {
        localStorage.setItem("user", JSON.stringify(user));
      } catch (e) {
        console.log("localStorage is not working");
      }
    }
  }, [history, user]);

  return (
    <AuthForm
      type="register"
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
      error={error}
    />
  );
};

export default withRouter(RegisterForm);
