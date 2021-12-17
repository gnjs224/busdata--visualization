import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
const Menu = styled.div`
  text-align: center;
  cursor: pointer;
  &:hover {
    color: black;
  }
  float: left;
  padding: 2px 50px 5px 50px;
`;
const Header = (props) => {
  var firstColor = "gray";
  var secondColor = "gray";
  var thirdcolor = "gray";
  var firstWeight = "initial";
  var secondWeight = "initial";
  var thirdWeight = "initial";
  if (props.type === 1) {
    firstColor = "black";
    firstWeight = "bold";
  } else if (props.type === 2) {
    secondColor = "black";
    secondWeight = "bold";
  } else {
    thirdcolor = "black";
    thirdWeight = "bold";
  }
  return (
    <>
      <div>
        <Link to="/">
          <Menu style={{ color: firstColor, fontWeight: firstWeight }}>
            노선 분석
          </Menu>
        </Link>
        <Link to="/test2">
          <Menu style={{ color: secondColor, fontWeight: secondWeight }}>
            지역 분석
          </Menu>
        </Link>
        <Link to="/test3">
          <Menu style={{ color: thirdcolor, fontWeight: thirdWeight }}>
            노선별 지역 분석
          </Menu>
        </Link>
      </div>
    </>
  );
};
export default Header;
