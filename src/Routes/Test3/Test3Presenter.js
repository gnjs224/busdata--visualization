import React from "react";
import Header from "../../Components/Header";
import styled from "styled-components";
const Key = styled.span`
  font-weight: bold;
  margin-left: 20px;
`;
const Log = styled.div`
  text-align: left;
  cursor: pointer;
  &:hover {
    color: gray;
  }
`;

const List = (props) => {
  const getBig = () => {
    console.log(props);
    var result = [];
    for (var i = 0; i < props.bus.length; i++) {
      console.log(typeof Object.keys(props.bus[i])[0]);
      result.push(
        <h2
          style={{ cursor: "pointer" }}
          // onClick={props.listClicker}
          // data-i={i}
          // data-type={i}
          // data-key={i}
          // onMouseOver={props.listOver}
          // onMouseOut={props.listOut}
        >
          {Object.keys(props.bus[i])[0]}
        </h2>
      );
      result.push(<h3 style={{ textAlign: "left" }}>지하철</h3>);
      var temp = getList("subway", props.subway[i], props, i);
      result.push(temp);
      result.push(<h3 style={{ textAlign: "left" }}>버스</h3>);
      temp = getList("bus", props.bus[i], props, i);
      result.push(temp);
    }
    return result;
  };
  const getList = (type, small, props, key) => {
    var result = [];
    var target = Object.values(small)[0];
    if (target.length === 0) {
      result.push(<div style={{ textAlign: "left" }}>없음</div>);
    }
    console.log(props);
    for (var i = 0; i < target.length; i++) {
      console.log(Object.keys(small)[0]);
      result.push(
        <Log
          style={{ textAlign: "left", cursor: "pointer" }}
          onClick={props.listClicker}
          data-i={i}
          data-type={type}
          data-key={key}
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

  return <div>{getBig()}</div>;
};
const Test3Presenter = (props) => {
  return (
    <>
      <Header type={3} />
      <br />
      <br />
      <div style={{ height: "85.5vh", textAlign: "center" }}>
        <div style={{ width: "30%", height: "95%", float: "left" }}>
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

        <div id="map" style={{ width: "70%", height: "95%" }}></div>
        <br />
        <div>
          <span style={{ fontSize: "13px" }}>반지름: </span>
          <input
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                props.setR(e);
              }
            }}
            style={{ marginLeft: "3px" }}
          ></input>
        </div>
        <Key>BUS:</Key>
        <span class="bus" onChange={props.setType}>
          <input
            type="radio"
            id="temp1"
            name="bus"
            value="temp1"
            checked={props.getType() === "temp1"}
            defaultValue={500}
          />
          <label for="temp1">노선1</label>
          <input type="radio" id="temp2" name="bus" value="temp2" />
          <label for="temp2">노선2</label>
          <input type="radio" id="temp3" name="bus" value="temp3" />
          <label for="temp3">노선3</label>
          <input type="radio" id="temp4" name="bus" value="temp4" />
          <label for="temp4">노선4</label>
          <input type="radio" id="temp5" name="bus" value="temp5" />
          <label for="temp5">노선5</label>
        </span>
        <div style={{ marginTop: "15px", height: "10%" }}>
          잠재 고객: {props.sum}명
        </div>
      </div>
    </>
  );
};

export default Test3Presenter;
