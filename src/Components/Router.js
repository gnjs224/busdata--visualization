import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Test from "../Routes/Test";
import Test2 from "../Routes/Test2";
import Test3 from "../Routes/Test3";
// eslint-disable-next-line
export default () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Test />} />
      <Route path="/test2" element={<Test2 />} />
      <Route path="/test3" element={<Test3 />} />
    </Routes>
  </BrowserRouter>
);
