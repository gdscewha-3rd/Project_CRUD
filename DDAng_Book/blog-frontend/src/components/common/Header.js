import React from "react";
import styled from "styled-components";
import Responsive from "./Responsive";
import Button from "./Button";
import { Link } from "react-router-dom";

const HeaderBlock = styled.div`
  position: fixed;
  width: 100%;
  background: white;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
`;

//Responsive 컴포넌트 속성에 스타일 추가해서 새로운 컴포넌트 작성

const Wrapper = styled(Responsive)`
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between; /*자식 엘리먼트 사이의 여백 최대로 작성*/
  .logo {
    font-size: 1.125rem;
    font-weight: 800;
    letter-spacing: 2px;
  }
  .right {
    display: flex;
    align-items: center;
  }
`;

//헤더가 fixed로 되어 있기 때문에 페이지 콘텐츠가 4rem 아래 나타나기
const Spacer = styled.div`
  height: 4rem;
`;

const UserInfo = styled.div`
  font-weight: 800;
  margin-right: 1rem;
`;

const Header = ({ user, onLogout }) => {
  return (
    <div>
      <HeaderBlock>
        <Wrapper>
          <Link to="/" className="logo">
            DDang_Book
          </Link>
          {user ? (
            <div className="right">
              <UserInfo>{user.username}</UserInfo>
              <Button onClick={onLogout}>로그아웃</Button>
            </div>
          ) : (
            <div className="right">
              <Button to="/login">로그인</Button>
            </div>
          )}
        </Wrapper>
      </HeaderBlock>
      <Spacer />
    </div>
  );
};

export default Header;
