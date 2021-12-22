import React from "react";
import styled from "styled-components";
import Header from "../../Components/Header";
const Log = styled.div`
  text-align: left;
  cursor: pointer;
  &:hover {
    color: gray;
  }
`;
const List = (props) => {
  const getList = (type) => {
    const result = [];
    var target = null;
    if (type === "bus") {
      result.push(<h3>버스</h3>);
      target = props.bus;
    } else {
      result.push(<h3>지하철</h3>);
      target = props.subway;
    }
    if (target.length === 0) {
      result.push(<div style={{ textAlign: "left" }}>없음</div>);
    }

    for (var i = 0; i < target.length; i++) {
      result.push(
        <Log
          style={{ textAlign: "left", cursor: "pointer" }}
          onClick={props.listClicker}
          data-i={i}
          data-type={type}
          onMouseOver={props.listOver}
          onMouseOut={props.listOut}
        >
          {target[i]["stnNm"] +
            (type === "subway" ? "역" : "") +
            "(" +
            target[i]["arsNo"] +
            ")"}
        </Log>
      );
    }
    return result;
  };

  return (
    <div>
      {getList("subway")}
      {getList("bus")}
    </div>
  );
};
const Test2Presenter = (props) => {
  return (
    <>
      <Header type={2} />
      <br />
      <br />
      <div style={{ width: "20%", float: "left", color: "white" }}>.</div>
      <div style={{ width: "80%", textAlign: "center" }}>
        <div style={{ float: "left" }}>
          <span style={{ fontSize: "20px" }}>검색어: </span>
          <input
            style={{ height: "2rem", fontSize: "1.5rem" }}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                props.setMap(e.target.value);
              }
            }}
          ></input>
        </div>
        <div
          style={{
            margin: "15px",
            height: "10%",
            fontSize: "20px",
          }}
        >
          잠재 고객: {(props.sum * 10).toLocaleString("ko-KR")}명
        </div>
      </div>
      <div style={{ height: "85.5vh", textAlign: "center" }}>
        <div style={{ width: "20%", height: "97%", float: "left" }}>
          <div style={{ overflow: "scroll", height: "100%" }}>
            <div>
              <List
                subway={props.subway}
                bus={props.bus}
                listClicker={props.listClicker}
                listOut={props.listOut}
                listOver={props.listOver}
              />
            </div>
          </div>
        </div>
        <div id="map" style={{ width: "80%", height: "97%" }}></div>
      </div>
    </>
  );
};
export default Test2Presenter;
