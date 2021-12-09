import React from "react";
import styled from "styled-components";
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
            "(" +
            (type === "subway" ? "역" : "") +
            target[i]["arsNo"] +
            ")"}
        </Log>
      );
      // result.push(<span key={i}>{weekArr[i] + " / "}</span>);
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
const CircleTestPresenter = (props) => {
  return (
    <>
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <span style={{ fontSize: "13px" }}>검색어: </span>
        <input
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              props.setMap(e.target.value);
            }
          }}
          style={{ marginLeft: "3px" }}
        ></input>
      </div>
      <div style={{ height: "91vh", textAlign: "center" }}>
        <div style={{ width: "30%", height: "90%", float: "left" }}>
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
        <div id="map" style={{ width: "70%", height: "90%" }}></div>
        <div style={{ marginTop: "15px", height: "10%" }}>
          잠재 고객: {props.sum}명
        </div>
      </div>
    </>
  );
};
export default CircleTestPresenter;
