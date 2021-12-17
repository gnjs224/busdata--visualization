/*global kakao*/
import React from "react";
import TestPresenter from "./TestPresenter";
import axios from "axios";
var map;
var circles = [];
var infowindow = new kakao.maps.InfoWindow({ removable: true });
var size = { 301: [0, 49, 99], 401: [0, 49, 98], 3011: [0, 44, 87] };
// eslint-disable-next-line
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bus: "301", //301, 401, 3011
      date: "ALL", //weekday: 주중, weekend: 주말, holiday: 공휴일, ALL: 전체
      onoff: "ALL", // ALL: 전체, TBR: 승차, TBA: 하차
      route: "ALL", // ALL: 전체, ASC: 상행, DESC: 하행
      time: [4, 28],
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
  }
  componentDidMount() {
    console.log("didmount");
    var container = document.getElementById("map");
    var options = {
      center: new kakao.maps.LatLng(37.541, 126.986),
      level: 8,
    };
    // eslint-disable-next-line
    map = new kakao.maps.Map(container, options);
    this.DrawMap();
  }
  DrawMap = () => {
    axios
      .get(
        "/products/" +
          this.state.bus +
          "/" +
          this.state.date +
          "/" +
          this.state.onoff +
          "/" +
          this.state.route
      )
      .then((res) => {
        while (circles.length !== 0) {
          circles.pop().setMap(null);
        }

        var data;
        data = res.data["products"];
        // console.log(data);
        var on =
          size[this.state.bus] === undefined ? 0 : size[this.state.bus][0];
        var off =
          size[this.state.bus] === undefined
            ? data.length - 1
            : size[this.state.bus][2];
        if (size[this.state.bus] !== undefined) {
          console.log(this.state.bus);
          if (this.state.route === "ASC") {
            off = size[this.state.bus][1];
          } else if (this.state.route === "DESC") {
            on = size[this.state.bus][1] + 1;
          }
        }

        for (var i = on; i <= off; i++) {
          this.DrawCircle(data[i]);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  DrawCircle = (data) => {
    var t = this.state.time;
    var tbrSum = 0;
    var tbaSum = 0;
    for (var i = t[0]; i < t[1]; i++) {
      var temp = i;
      if (temp > 23) {
        temp -= 24;
      }
      tbrSum += data["TBR" + temp];
      tbaSum += data["TBA" + temp];
    }
    tbrSum = Math.round(tbrSum);
    tbaSum = Math.round(tbaSum);
    var circleSize = tbrSum;
    if (this.state.onoff === "TBA") {
      circleSize = tbaSum;
    } else if (this.state.onoff === "ALL") {
      circleSize = tbrSum + tbaSum;
    }
    circleSize = circleSize * 2 + 10;
    var circleColor = "red";
    var hoverColor = "#fa752d";
    var text1 = "상행";
    if (size[this.state.bus] === undefined) {
      circleColor = "green";
      hoverColor = "lightgreen";
      text1 = "";
    } else if (data["SEQ"] > size[this.state.bus][1] + 1) {
      circleColor = "blue";
      hoverColor = "#2d8dfa";
      text1 = "하행";
    }

    var circle = new kakao.maps.Circle({
      center: new kakao.maps.LatLng(data["LOC_X"], data["LOC_Y"]), // 원의 중심좌표 입니다
      radius: circleSize, // 미터 단위의 원의 반지름입니다
      strokeWeight: 2, // 선의 두께입니다
      strokeColor: "white", // 선의 색깔입니다
      strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
      strokeStyle: "solid", // 선의 스타일 입니다
      fillColor: circleColor, // 채우기 색깔입니다
      fillOpacity: 0.7, // 채우기 불투명도 입니다
      zIndex: 1 / circleSize,
    });

    kakao.maps.event.addListener(circle, "mouseover", function (mouseEvent) {
      circle.setOptions({ fillColor: hoverColor });
    });
    kakao.maps.event.addListener(circle, "mouseout", function () {
      circle.setOptions({ fillColor: circleColor });
    });
    kakao.maps.event.addListener(circle, "click", function (mouseEvent) {
      console.log(circle.getZIndex(), 1 / 50);
      var content =
        "<div style='text-align: left; width: 130%; padding:10px;'> 정류장 번호: " +
        data.BUS_ARS_NO +
        "<br>정류장 이름: " +
        data.BUS_BSST_NM +
        "<br> 전체 인원: " +
        (tbaSum + tbrSum) +
        "<br> 승차 인원: " +
        tbrSum +
        "<br> 하차 인원: " +
        tbaSum +
        "<br>" +
        text1 +
        "</div>";
      infowindow.setContent(content);
      infowindow.setPosition(mouseEvent.latLng);
      infowindow.setMap(map);
    });

    circle.setMap(map);
    circles.push(circle);
  };
  getBus = () => {
    return this.state.bus;
  };
  setBus = (e) => {
    this.setState({ bus: e.target.value });
  };
  getDate = () => {
    return this.state.date;
  };
  setDate = (e) => {
    this.setState({ date: e.target.value });
  };
  getOnoff = () => {
    return this.state.onoff;
  };
  setOnoff = (e) => {
    this.setState({ onoff: e.target.value });
  };
  getRoute = () => {
    return this.state.route;
  };
  setRoute = (e) => {
    this.setState({ route: e.target.value });
  };
  getTime = () => {
    return this.state.time;
  };
  setTime = (newValue) => {
    this.setState({ time: newValue });
  };
  render() {
    const { data } = this.state; //변수
    const {
      getBus,
      getDate,
      getRoute,
      getOnoff,
      getTime,
      setBus,
      setDate,
      setOnoff,
      setRoute,
      setTime,
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
        setTime={setTime}
        getTime={getTime}
        data={data}
      />
    );
  }
}
