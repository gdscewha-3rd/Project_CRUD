import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import palette from "../../lib/styles/palette";
import Button from "../common/Button";

// 회원가입 또는 로그인 폼

//최상위 컴포넌트로 Block 붙임
const AuthFormBlock = styled.div`
  h3 {
    margin: 0;
    color: ${palette.gray[8]};
    margin-bottom: 1rem;
  }
`;

//input 스타일링 적용
const StyledInput = styled.input`
  font-size: 1rem;
  border: none;
  border-bottom: 1px solid ${palette.gray[5]};
  padding-bottom: 0.5rem;
  outline: none;
  width: 100%;
  &:focus {
    color: $0c-teal-7;
    border-bottom: 1px solid ${palette.gray[7]};
  }
  & + & {
    margin-top: 1rem;
  }
`;

//로그인에서 회원가입 이동, 회원가입에서 로그인 이동하는 Footer 스타일링
const Footer = styled.div`
  margin-top: 2rem;
  text-align: right;
  a {
    color: ${palette.gray[6]};
    text-decoration: underline;
    & :hover {
      color: ${palette.gray[9]};
    }
  }
`;

const ButtonWithMarginTop = styled(Button)`
  margin-top: 1rem;
`;

const textMap = {
  register: "회원가입",
  login: "로그인",
};

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  font-size: 0.85rem;
  margin-top: 1rem;
`;
const AuthForm = ({ type, form, onChange, onSubmit, error }) => {
  const text = textMap[type];
  return (
    <AuthFormBlock>
      <h3>{text}</h3>
      <form onSubmit={onSubmit}>
        <StyledInput
          autoComplete="username"
          name="username"
          placeholder="아이디"
          onChange={onChange}
          value={form.username}
        />
        <StyledInput
          autoComplete="new-password"
          name="password"
          placeholder="비밀번호"
          type="password"
          onChange={onChange}
          value={form.password}
        />

        {/*회원가입 부분에는 비밀번호 확인하는 칸 필요*/}
        {type === "register" && (
          <StyledInput
            autoComplete="new-password"
            name="passwordConfirm"
            placeholder="비밀번호 확인"
            type="password"
            onChange={onChange}
            value={form.passwordConfirm}
          />
        )}
        {error && <ErrorMessage> {error}</ErrorMessage>}
        <ButtonWithMarginTop cran fullWidth>
          {text}
        </ButtonWithMarginTop>
      </form>
      <Footer>
        {/*회원가입이면 클릭해 로그인으로 감, 로그인이면 클릭해 회원가입으로 감 */}
        {type === "login" ? (
          <Link to="/register">회원가입</Link>
        ) : (
          <Link to="/login"> 로그인</Link>
        )}
      </Footer>
    </AuthFormBlock>
  );
};

export default AuthForm;
