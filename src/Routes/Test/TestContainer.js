/*global kakao*/
import React from "react";
import TestPresenter from "./TestPresenter";
import axios from "axios";
var map;
// eslint-disable-next-line
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bus: "301", //301, 401, 3011
      date: "ALL", //weekday: 주중, weekend: 주말, holiday: 공휴일, ALL: 전체
      onoff: "ALL", // ALL: 전체, TBR: 승차, TBA: 하차
      route: "ALL", // ALL: 전체, ASC: 상행, DESC: 하행
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.bus !== prevState.bus ||
      this.state.date !== prevState.date ||
      this.state.onoff !== prevState.onff ||
      this.state.route !== prevState.route
    ) {
      this.DrawMap();
    }
    console.log(this.state);
  }
  componentDidMount() {
    console.log("didmount");
    var container = document.getElementById("map");
    var options = {
      center: new kakao.maps.LatLng(37.541, 126.986),
      level: 9,
    };
    // eslint-disable-next-line
    map = new kakao.maps.Map(container, options);
  }
  DrawMap = () => {
    axios
      .get("/products/" + this.state.bus)
      .then((res) => {
        var data;
        data = res.data["products"];

        console.log(data);
        var a = "red";
        if (this.state.bus === "301") {
          a = "blue";
        } else if (this.state.bus === "401") {
          a = "green";
        } else {
          a = "orange";
        }
        var circle = new kakao.maps.Circle({
          center: new kakao.maps.LatLng(37.541, 126.986), // 원의 중심좌표 입니다
          radius: 500, // 미터 단위의 원의 반지름입니다
          strokeWeight: 5, // 선의 두께입니다
          strokeColor: "#75B8FA", // 선의 색깔입니다
          strokeOpacity: 0, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
          strokeStyle: "dashed", // 선의 스타일 입니다
          fillColor: a, //"#CFE7FF", // 채우기 색깔입니다
          fillOpacity: 1, // 채우기 불투명도 입니다
        });

        circle.setMap(map);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  getBus = (e) => {
    return this.state.bus;
  };
  setBus = (e) => {
    this.setState({ bus: e.target.value });
  };
  getDate = (e) => {
    return this.state.date;
  };
  setDate = (e) => {
    this.setState({ date: e.target.value });
  };
  getOnoff = (e) => {
    return this.state.onoff;
  };
  setOnoff = (e) => {
    this.setState({ onoff: e.target.value });
  };
  getRoute = (e) => {
    return this.state.route;
  };
  setRoute = (e) => {
    this.setState({ route: e.target.value });
  };
  render() {
    const { data } = this.state; //변수
    const {
      getBus,
      getDate,
      getRoute,
      getOnoff,
      setBus,
      setDate,
      setOnoff,
      setRoute,
    } = this; //함수
    return (
      <TestPresenter
        getBus={getBus}
        getDate={getDate}
        getRoute={getRoute}
        getOnoff={getOnoff}
        setBus={setBus}
        setDate={setDate}
        setRoute={setRoute}
        setOnoff={setOnoff}
        data={data}
      />
    );
  }
}
