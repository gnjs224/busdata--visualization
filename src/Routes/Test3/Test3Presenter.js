import React from "react";
import Header from "../../Components/Header";
import styled from "styled-components";
const Key = styled.span`
  font-weight: bold;
  font-size: 20px;
`;
const Log = styled.div`
  text-align: left;
  cursor: pointer;
  &:hover {
    color: gray;
  }
`;
const Nav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  left: 0;
  top: 0;
  width: 80%;
`;
const Left = styled.div`
  width: 410px;
`;
const Main = styled.div`
  padding-left: 0;
`;
const Right = styled.div`
  width: 410px;
`;
const ColorBox = styled.div`
  width: 10px;
  height: 10px;
  background: black;
  display: inline-block;
  margin-left: 10px;
`;
const SmallBox = styled.div`
  font-size: 10px;
  text-align: right;
`;
const HomeList = (props) => {
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

      <div style={{ height: "85.5vh" }}>
        <div style={{ width: "20%", color: "white", float: "left" }}>.</div>
        <Nav>
          <Left>
            <div>
              <span style={{ fontSize: "20px" }}>반지름(m): </span>
              <input
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    props.setR(e);
                  }
                }}
                style={{
                  marginLeft: "3px",
                  height: "2rem",
                  fontSize: "1.5rem",
                }}
                defaultValue={500}
              ></input>
            </div>
            <Key>BUS:</Key>
            <span
              class="bus"
              onChange={props.setType}
              style={{ fontSize: "20px" }}
            >
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
          </Left>

          <Main style={{ margin: "15px", fontSize: "20px" }}>
            <div>주요 역: {props.bus.length}개</div>
            <div>잠재 고객: {(props.sum * 10).toLocaleString("ko-KR")}명</div>
          </Main>

          <Right style={{ fontSize: "10px" }}>
            <SmallBox>
              0~2000
              <ColorBox style={{ background: props.getColors()[8] }}></ColorBox>
            </SmallBox>
            <SmallBox>
              2001~4000
              <ColorBox style={{ background: props.getColors()[7] }}></ColorBox>
            </SmallBox>
            <SmallBox>
              4001~6000
              <ColorBox style={{ background: props.getColors()[6] }}></ColorBox>
            </SmallBox>
            <SmallBox>
              6001~8000
              <ColorBox style={{ background: props.getColors()[5] }}></ColorBox>
            </SmallBox>
            <SmallBox>
              8001~10000
              <ColorBox style={{ background: props.getColors()[4] }}></ColorBox>
            </SmallBox>
            <SmallBox>
              10001~12000
              <ColorBox style={{ background: props.getColors()[3] }}></ColorBox>
            </SmallBox>
            <SmallBox>
              12001~14000
              <ColorBox style={{ background: props.getColors()[2] }}></ColorBox>
            </SmallBox>
            <SmallBox>
              14001~16000
              <ColorBox style={{ background: props.getColors()[1] }}></ColorBox>
            </SmallBox>
            <SmallBox>
              16001~
              <ColorBox style={{ background: props.getColors()[0] }}></ColorBox>
            </SmallBox>
          </Right>
        </Nav>
        <div style={{ width: "20%", height: "95%", float: "left" }}>
          <div style={{ overflow: "scroll", height: "100%" }}>
            <div>
              <HomeList
                subway={props.subway}
                bus={props.bus}
                listEventHandler={props.listEventHandler}
                listClicker={props.listClicker}
                listOut={props.listOut}
                listOver={props.listOver}
              />
            </div>
          </div>
        </div>

        <div id="map" style={{ width: "80%", height: "95%" }}></div>
      </div>
    </>
  );
};

export default Test3Presenter;
