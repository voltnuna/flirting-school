import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import loadable from "@loadable/component";
import { Link } from "react-router-dom";

const LogIn = loadable(() => import("@pages/Login"));
const SignUp = loadable(() => import("@pages/Signup"));
const Workspace = loadable(() => import("@layouts/Workspace"));

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/" element={<LogIn />}></Route>
          <Route path="/workspace" element={<Workspace />}></Route>
          <Route
            path="/workspace/:workspace/dms/:id/chats"
            element={<Workspace />}
          ></Route>
          <Route
            path="/workspace/:workspace/users/:id"
            element={<Workspace />}
          ></Route>
          <Route
            path="/workspace/:workspace/channel/:channel"
            element={<Workspace />}
          ></Route>
          <Route path="/workspace/:workspace" element={<Workspace />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
//EX) ws:학년 > ch:반 > dm: 학생끼리 대화
