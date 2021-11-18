import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import Test from "../Routes/Test";
// eslint-disable-next-line
export default () => (
  <BrowserRouter>
    <Routes>
        <Route path="/" element={<Test />} />
    </Routes>
  </BrowserRouter>
);