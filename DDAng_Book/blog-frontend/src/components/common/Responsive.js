//반응형 설정

import React from "react";
import styled from "styled-components";

const ResponsiveBlock = styled.div`
  padding-left: 1rem;
  padding-rigth: 1rem;
  width: 1024px;
  margin: 0 auto; /*중앙 정렬*/

  // 브라우저 크기에 따라 가로 길이 조정
  @media (max-width: 1024px) {
    width: 768px;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Responsive = ({ children, ...rest }) => {
  //styled, className, onClick, onMouseMove, 등의 props 사용할수 있도록
  //...rest 사용해 ResponsiveBlock에게 전달

  return <ResponsiveBlock {...rest}>{children}</ResponsiveBlock>;
};

export default Responsive;
