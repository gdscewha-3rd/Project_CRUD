import "./App.css";
import React from "react";
import { Route } from "react-router-dom";
import PostListPage from "./pages/PostListPage";
import LoginPage from "./pages/LoginPage";
import PostPage from "./pages/PostPage";
import RegisterPage from "./pages/RegisterPage";
import WritePage from "./pages/WritePage";
import { Helmet } from "react-helmet-async";

function App() {
  return (
    <>
      <Helmet>
        <title>DDang_Book</title>
      </Helmet>
      <Route component={LoginPage} path="/login" />
      <Route component={WritePage} path="/write" />
      <Route component={RegisterPage} path="/register" />
      <Route component={PostPage} path="/@:username/:postId" />
      <Route component={PostListPage} path={["/@:username", "/"]} exact />
    </>
  );
}

export default App;
