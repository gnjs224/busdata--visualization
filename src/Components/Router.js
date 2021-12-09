import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Test from "../Routes/Test";
import CircleTest from "../Routes/CircleTest";
// eslint-disable-next-line
export default () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Test />} />
      <Route path="/test2" element={<CircleTest />} />
    </Routes>
  </BrowserRouter>
);
