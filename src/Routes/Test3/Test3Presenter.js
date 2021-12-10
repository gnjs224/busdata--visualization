import React from "react";
import Header from "../../Components/Header";
import styled from "styled-components";
const Key = styled.span`
  font-weight: bold;
  margin-left: 20px;
`;
const Test3Presenter = (props) => {
  return (
    <>
      <Header type={3} />
      <div style={{ height: "92vh", textAlign: "center" }}>
        <div id="map" style={{ width: "100%", height: "90%" }}></div>
        <div>
          <span style={{ fontSize: "13px" }}>반지름: </span>
          <input
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                // props.setMap(e.target.value);
              }
            }}
            style={{ marginLeft: "3px" }}
          ></input>
        </div>
        <Key>BUS:</Key>
        <span class="bus">
          <input type="radio" id="노선1" name="bus" value="노선1" />
          <label for="노선1">노선1</label>
          <input type="radio" id="노선2" name="bus" value="노선2" />
          <label for="노선2">노선2</label>
          <input type="radio" id="노선3" name="bus" value="노선3" />
          <label for="노선3">노선3</label>
          <input type="radio" id="노선4" name="bus" value="노선4" />
          <label for="노선4">노선4</label>
          <input type="radio" id="노선5" name="bus" value="노선5" />
          <label for="노선5">노선5</label>
        </span>
      </div>
    </>
  );
};
export default Test3Presenter;
