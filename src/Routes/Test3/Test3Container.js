/*global kakao*/
import React from "react";
import Test3Presenter from "./Test3Presenter";
import "./style.css";
import axios from "axios";
var map;
var circles = [];
var bigCircles = [];
var infowindow = new kakao.maps.InfoWindow({ removable: true });
var color1 = "#4d0000";
var color2 = "#800000";
var color3 = "#b30000";
var color4 = "#e60000";
var color5 = "#ff1a1a";
var color6 = "#ff4d4d";
var color7 = "#ff8080";
var color8 = "#ffb3b3";
var color9 = "#ffe6e6";
// eslint-disable-next-line
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { subway: [], bus: [], sum: 0, r: 0, type: "" };
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
    this.setState({ r: 500, type: "temp1" });
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.state.r !== prevState.r || this.state.type !== prevState.type) {
      console.log("component updated");
      await axios
        .get("/products/" + this.state.type + "/ALL/ALL/ALL")
        .then((res) => {
          this.addCircle(res);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }
  async addCircle(res) {
    var big = res.data.products;
    while (circles.length !== 0) {
      circles.pop().setMap(null);
    }
    while (bigCircles.length !== 0) {
      bigCircles.pop().setMap(null);
    }
    // this.setState({ bus: [], subway: [], sum: 0 });
    var sum = 0;
    var bus = [];
    var subway = [];
    for (var i = 0; i < big.length; i++) {
      var result = await this.addBig(big[i]);
      // console.log(result);
      bus.push(result[1]);
      subway.push(result[0]);
      sum += result[2];
    }
    // console.log(sum, bus, subway);
    this.setState({
      bus: bus,
      subway: subway,
      sum: sum,
    });
    // console.log(big);
  }
  async addBig(big) {
    const center = new kakao.maps.LatLng(big["LOC_X"], big["LOC_Y"]);

    const key = big["BUS_BSST_NM"];

    var tempSum = 0;
    var tempBus = { [key]: [] };
    var tempSubway = { [key]: [] };
    await axios
      .get("/around/" + big["LOC_X"] + "/" + big["LOC_Y"] + "/" + this.state.r)
      .then((res) => {
        // console.log(res.data.products);
        var data = res.data.products;

        // console.log(tempSubway, tempBus, tempSum);

        for (var i = 0; i < data.length; i++) {
          const locX = data[i]["LOC_X"];
          const locY = data[i]["LOC_Y"];
          const pCount = data[i]["P_COUNT"];
          const stnId = data[i]["STN_ID"];
          const stnNm = data[i]["STN_NM"];
          const arsNo = data[i]["ARS_NO"];
          const c = this.addSmall(locX, locY, pCount, stnNm, arsNo, stnId);

          tempSum += pCount;
          if (stnId.length === 4) {
            tempSubway[key].push({
              stnNm: stnNm,
              arsNo: arsNo,
              pCount: pCount,
              circle: c,
            });
          } else {
            tempBus[key].push({
              stnNm: stnNm,
              arsNo: arsNo,
              pCount: pCount,
              circle: c,
            });
          }
        }
        //tempBus에 큰 circle 추가하기
        tempBus[key].sort(function (a, b) {
          return b["pCount"] - a["pCount"];
        });
        tempSubway[key].sort(function (a, b) {
          return b["pCount"] - a["pCount"];
        });
        // console.log(this.state.sum, this.state.bus, this.state.subway);
      })
      .catch((e) => {
        console.log(e);
      });
    var circleColor = "";

    if (this.state.type === "temp2") {
      color1 = "#4d1f00";
      color2 = "#803300";
      color3 = "#b34700";
      color4 = "#e65c00";
      color5 = "#ff751a";
      color6 = "#ff944d";
      color7 = "#ffb380";
      color8 = "#ffd1b3";
      color9 = "#fff0e6";
    } else if (this.state.type === "temp3") {
      color1 = "#4d4d00";
      color2 = "#808000";
      color3 = "#b3b300";
      color4 = "#e6e600";
      color5 = "#ffff1a";
      color6 = "#ffff4d";
      color7 = "#ffff80";
      color8 = "#ffffb3";
      color9 = "#ffffe6";
    } else if (this.state.type === "temp4") {
      color1 = "#004d00";
      color2 = "#008000";
      color3 = "#00b300";
      color4 = "#00e600";
      color5 = "#1aff1a";
      color6 = "#4dff4d";
      color7 = "#80ff80";
      color8 = "#b3ffb3";
      color9 = "#e6ffe6";
    } else if (this.state.type === "temp5") {
      color1 = "#00004d";
      color2 = "#000080";
      color3 = "#0000b3";
      color4 = "#0000e6";
      color5 = "#1a1aff";
      color6 = "#4d4dff";
      color7 = "#8080ff";
      color8 = "#b3b3ff";
      color9 = "#e6e6ff";
    }
    switch (parseInt(tempSum / 2000)) {
      case 0:
        circleColor = color9;
        break;
      case 1:
        circleColor = color8;
        break;
      case 2:
        circleColor = color7;
        break;
      case 3:
        circleColor = color6;
        break;
      case 4:
        circleColor = color5;
        break;
      case 5:
        circleColor = color4;
        break;
      case 6:
        circleColor = color3;
        break;
      case 7:
        circleColor = color2;
        break;
      case 8:
        circleColor = color1;
        break;
      default:
        circleColor = color1;
        break;
    }
    // const fill = 0.1;
    var circle = new kakao.maps.Circle({
      center: center, // 원의 중심좌표 입니다
      radius: this.state.r, // 미터 단위의 원의 반지름입니다
      strokeWeight: 3, // 선의 두께입니다
      strokeColor: "white", // 선의 색깔입니다
      strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
      strokeStyle: "solid", // 선의 스타일 입니다
      fillColor: circleColor, // 채우기 색깔입니다
      fillOpacity: 1, // 채우기 불투명도 입니다
      zIndex: 0,
    });

    kakao.maps.event.addListener(circle, "mouseover", function () {
      circle.setOptions({ fillOpacity: 0.5 });
      map.setCursor("pointer");
    });
    kakao.maps.event.addListener(circle, "mouseout", function () {
      circle.setOptions({ fillOpacity: 1 });
      map.setCursor("grab");
    });
    kakao.maps.event.addListener(circle, "click", function (mouseEvent) {
      var content =
        "<div class = 'window'><span class = 'title'>역 이름 </span><br>" +
        key +
        "<br><br><span class = 'title'> 주거 정류장 수</span> <br>지하철: " +
        tempSubway[key].length +
        "<br>버스: " +
        tempBus[key].length +
        "<br><br> <span class = 'title'> 잠재고객 수 </span><br>" +
        tempSum.toLocaleString("ko-KR") +
        "</div>";
      infowindow.setContent(content);
      if (mouseEvent === "trigger") {
        infowindow.setPosition(circle.getPosition());
      } else {
        infowindow.setPosition(mouseEvent.latLng);
      }
      infowindow.setMap(map);
    });
    bigCircles.push(circle);
    circle.setMap(map);
    return [tempSubway, tempBus, tempSum];
  }
  addSmall = (locX, locY, pCount, stnNm, arsNo, stnId) => {
    var c = new kakao.maps.Circle({
      center: new kakao.maps.LatLng(locX, locY), // 원의 중심좌표 입니다
      radius: pCount / 20, // 미터 단위의 원의 반지름입니다
      strokeWeight: 2, // 선의 두께입니다
      strokeColor: "black", // 선의 색깔입니다
      strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
      strokeStyle: "solid", // 선의 스타일 입니다
      fillColor: "black", // 채우기 색깔입니다
      fillOpacity: 0.1, // 채우기 불투명도 입니다
      zIndex: 1 / pCount,
    });
    kakao.maps.event.addListener(c, "mouseover", function () {
      c.setOptions({ fillOpacity: 0.7 });
      map.setCursor("pointer");
    });
    kakao.maps.event.addListener(c, "mouseout", function () {
      c.setOptions({ fillOpacity: 0.1 });
      map.setCursor("grab");
    });
    kakao.maps.event.addListener(c, "click", function (mouseEvent) {
      var content =
        "<div class = 'window'> 구분: " +
        (stnId.length === 4 ? "지하철" : "버스") +
        "<br>정류장 번호: " +
        arsNo +
        "<br>정류장 이름: " +
        stnNm +
        "<br> 인구: " +
        pCount.toLocaleString("ko-KR") +
        "</div>";
      infowindow.setContent(content);
      if (mouseEvent === "trigger") {
        infowindow.setPosition(c.getPosition());
      } else {
        infowindow.setPosition(mouseEvent.latLng);
      }
      infowindow.setMap(map);
    });

    c.setMap(map);
    circles.push(c);
    return c;
  };

  getType = () => {
    return this.state.type;
  };
  setType = (e) => {
    this.setState({ type: e.target.value });
  };
  setR = (e) => {
    var r = Number(e.target.value);
    if (isNaN(r)) {
      alert("숫자만 입력하세요 !");
    } else {
      this.setState({ r: Number(e.target.value) });
    }
  };

  listEventHandler = (e) => {
    const index = e.target.dataset.i;
    const type = e.target.dataset.type;
    const key = e.target.dataset.k;
    var target = null;
    if (type === "big") {
      target = bigCircles[key];
    } else {
      if (type === "bus") {
        target = Object.values(this.state.bus[key])[0][index]["circle"];
      } else {
        target = Object.values(this.state.subway[key])[0][index]["circle"];
      }
    }

    kakao.maps.event.trigger(
      target,
      e.type,
      e.type === "click" ? "trigger" : null
    );
  };
  getColors = () => {
    return [
      color1,
      color2,
      color3,
      color4,
      color5,
      color6,
      color7,
      color8,
      color9,
    ];
  };
  render() {
    const { subway, bus, sum } = this.state;
    return (
      <Test3Presenter
        setR={this.setR}
        setType={this.setType}
        getType={this.getType}
        subway={subway}
        bus={bus}
        sum={sum}
        listClicker={this.listClicker}
        listOut={this.listOut}
        listOver={this.listOver}
        listEventHandler={this.listEventHandler}
        getColors={this.getColors}
      />
    );
  }
}
