import React from "react";
import Header from "../../Components/Header";
const Test4Presenter = (props) => {
  return (
    <>
      <Header type={4} />
      <div style={{ height: "90vh", textAlign: "center" }}>
        <div id="map" style={{ width: "100%", height: "100%" }}></div>{" "}
      </div>
    </>
  );
};
export default Test4Presenter;
