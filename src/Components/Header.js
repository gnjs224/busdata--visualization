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
  var test1 = "gray";
  var test2 = "gray";
  var test3 = "gray";
  if (props.type === 1) {
    test1 = "black";
  } else if (props.type === 2) {
    test2 = "black";
  } else {
    test3 = "black";
  }
  return (
    <>
      <div>
        <Link to="/">
          <Menu style={{ color: test1 }}>test1</Menu>
        </Link>
        <Link to="/test2">
          <Menu style={{ color: test2 }}>test2</Menu>
        </Link>
        <Link to="/test3">
          <Menu style={{ color: test3 }}> test3</Menu>
        </Link>
      </div>
    </>
  );
};
export default Header;
