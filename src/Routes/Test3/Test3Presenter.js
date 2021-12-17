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
const HomeList = (props) => {
  console.log("rendered", props);
  const result = [];
  for (var i = 0; i < props.bus.length; i++) {
    // console.log(typeof Object.keys(props.bus[i])[0]);
    const bsstNm = Object.keys(props.bus[i])[0]; //정류장 이름
    result.push(
      <h2
        style={{ cursor: "pointer" }}
        onClick={props.listEventHandler}
        data-i={-1}
        data-type={"big"}
        data-k={i}
        onMouseOver={props.listEventHandler}
        onMouseOut={props.listEventHandler}
      >
        {bsstNm}
      </h2>
    );
    result.push(<h3 style={{ textAlign: "left" }}>지하철</h3>);
    var temp = getList("subway", props.subway[i], props, i);
    result.push(temp);
    result.push(<h3 style={{ textAlign: "left" }}>버스</h3>);
    temp = getList("bus", props.bus[i], props, i);
    result.push(temp);
  }

  return <div>{result}</div>;
};
const getList = (type, small, props, key) => {
  console.log(type);
  var result = [];
  var target = Object.values(small)[0];
  if (target.length === 0) {
    result.push(<div style={{ textAlign: "left" }}>없음</div>);
  }
  for (var i = 0; i < target.length; i++) {
    result.push(
      <Log
        style={{ textAlign: "left", cursor: "pointer" }}
        onClick={props.listEventHandler}
        data-i={i}
        data-type={type}
        data-k={key}
        onMouseOver={props.listEventHandler}
        onMouseOut={props.listEventHandler}
      >
        {target[i]["stnNm"] +
          (type === "subway" ? "역" : "") +
          "(" +
          target[i]["arsNo"] +
          ")"}
      </Log>
    );
    // result.push(<span key={i}>{weekArr[i] + " / "}</span>);
  }
  return result;
};
const Test3Presenter = (props) => {
  return (
    <>
      <Header type={3} />
      <br />
      <br />

      <div style={{ height: "85.5vh", textAlign: "center" }}>
        <div>
          <div>
            <span style={{ fontSize: "13px" }}>반지름: </span>
            <input
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  props.setR(e);
                }
              }}
              style={{ marginLeft: "3px" }}
              defaultValue={500}
            ></input>
          </div>
          <Key>BUS:</Key>
          <span class="bus" onChange={props.setType}>
            <input
              type="radio"
              id="temp1"
              name="bus"
              value="temp1"
              readOnly={true}
              checked={props.getType() === "temp1"}
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

          <div style={{ margin: "15px", fontSize: "20px" }}>
            <div>주요 역: {props.bus.length}개</div>
            <div>잠재 고객: {props.sum.toLocaleString("ko-KR")}명</div>
          </div>
        </div>
        <div style={{ width: "30%", height: "95%", float: "left" }}>
          <div style={{ overflow: "scroll", height: "100%" }}>
            <div>
              {console.log("start")}
              <HomeList
                subway={props.subway}
                bus={props.bus}
                listEventHandler={props.listEventHandler}
                listClicker={props.listClicker}
                listOut={props.listOut}
                listOver={props.listOver}
              />
              {console.log("end")}
            </div>
          </div>
        </div>

        <div id="map" style={{ width: "70%", height: "95%" }}></div>
      </div>
    </>
  );
};

export default Test3Presenter;
