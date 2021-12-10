import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Test from "../Routes/Test";
import CircleTest from "../Routes/CircleTest";
import Test3 from "../Routes/Test3";
// eslint-disable-next-line
export default () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Test />} />
      <Route path="/test2" element={<CircleTest />} />
      <Route path="/test3" element={<Test3 />} />
    </Routes>
  </BrowserRouter>
);
