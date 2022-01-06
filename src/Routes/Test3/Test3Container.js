/*global kakao*/
import React from "react";
import Test3Presenter from "./Test3Presenter";
import "./style.css";
import axios from "axios";
var map;
var circles = [];
var bigCircles = [];
var infowindow = new kakao.maps.InfoWindow({ removable: true });
var color1, color2, color3, color4, color5;
var max;
// eslint-disable-next-line
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { subway: [], bus: [], sum: 0, r: 0, type: "", colors: [] };
  }
  componentDidMount() {
    console.log("didmount");
    var container = document.getElementById("map");
    var options = {
      center: new kakao.maps.LatLng(37.5416974, 127.017278),
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
    max = 0;
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
    //setColor
    await this.setColor();
  }
  async setColor() {
    for (const i in bigCircles) {
      var circleColor = "";
      if (this.state.type === "temp1") {
        color1 = "#ffe6e6";
        color2 = "#ff6666";
        color3 = "#ff0000";
        color4 = "#990000";
        color5 = "#4d0000";
      } else if (this.state.type === "temp2") {
        color1 = "#fff2e6";
        color2 = "#ffbf80";
        color3 = "#ff9933";
        color4 = "#b35900";
        color5 = "#663300";
      } else if (this.state.type === "temp3") {
        color1 = "#ffffe6";
        color2 = "#ffff66";
        color3 = "#ffff00";
        color4 = "#999900";
        color5 = "#4d4d00";
      } else if (this.state.type === "temp4") {
        color1 = "#ccffcc";
        color2 = "#66ff66";
        color3 = "#00ff00";
        color4 = "#009900";
        color5 = "#004d00";
      } else if (this.state.type === "temp5") {
        color1 = "#e6e6ff";
        color2 = "#8080ff";
        color3 = "#0000ff";
        color4 = "#000099";
        color5 = "#00004d";
      }
      this.setState({ colors: [color1, color2, color3, color4, color5] });
      switch (parseInt((-bigCircles[i].getZIndex() * 10) / max)) {
        case 0:
        case 1:
        case 2:
          circleColor = color1;
          break;
        case 3:
        case 4:
          circleColor = color2;
          break;
        case 5:
        case 6:
          circleColor = color3;
          break;
        case 7:
        case 8:
          circleColor = color4;
          break;
        case 9:
        case 10:
          circleColor = color5;
          break;
        default:
          circleColor = color1;
          break;
      }
      bigCircles[i].setOptions({ fillColor: circleColor });
    }
  }
  getColors = () => {
    return this.state.colors;
  };
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
          const pCount = data[i]["pCount"];
          const stnId = data[i]["STN_ID"];
          const stnNm = data[i]["STN_NM"];
          const arsNo = data[i]["ARS_NO"];
          const c = this.addSmall(locX, locY, pCount, stnNm, arsNo, stnId);
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
    await axios
      .get(
        "/customer/" + big["LOC_X"] + "/" + big["LOC_Y"] + "/" + this.state.r
      )
      .then((res) => {
        const set = new Set();
        const data = res.data.products;
        for (var d in data) {
          set.add(data[d]["TRCR_NO"]);
        }
        tempSum = set.size;
        max = Math.max(max, tempSum);
      })
      .catch((e) => {
        console.log(e);
      });
    //max구해서 max에 대한 1/9

    // const fill = 0.1;
    var circle = new kakao.maps.Circle({
      center: center, // 원의 중심좌표 입니다
      radius: this.state.r, // 미터 단위의 원의 반지름입니다
      strokeWeight: 3, // 선의 두께입니다
      strokeColor: "white", // 선의 색깔입니다
      strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
      strokeStyle: "solid", // 선의 스타일 입니다
      fillColor: "black", // 채우기 색깔입니다
      fillOpacity: 1, // 채우기 불투명도 입니다
      zIndex: -tempSum,
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
        (tempSum * 10).toLocaleString("ko-KR") +
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
      radius: pCount / 10, // 미터 단위의 원의 반지름입니다
      strokeWeight: 2, // 선의 두께입니다
      strokeColor: "aqua", // 선의 색깔입니다
      strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
      strokeStyle: "solid", // 선의 스타일 입니다
      fillColor: "aqua", // 채우기 색깔입니다
      fillOpacity: 0.5, // 채우기 불투명도 입니다
      zIndex: 1 / (pCount / 10),
    });
    kakao.maps.event.addListener(c, "mouseover", function () {
      c.setOptions({ fillOpacity: 1 });
      map.setCursor("pointer");
    });
    kakao.maps.event.addListener(c, "mouseout", function () {
      c.setOptions({ fillOpacity: 0.5 });
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
  getMax = () => {
    return max * 10;
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
        getMax={this.getMax}
      />
    );
  }
}
