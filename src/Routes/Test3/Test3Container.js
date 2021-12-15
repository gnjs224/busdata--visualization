/*global kakao*/
import React from "react";
import Test3Presenter from "./Test3Presenter";
import "./style.css";
import axios from "axios";
var map;
var circles = [];
var bigCircles = [];
var infowindow = new kakao.maps.InfoWindow({ removable: true });
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
      level: 9,
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
      console.log("done");
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
    var circleColor = "red";
    var fillColor = "#ffcccb";
    if (this.state.type === "temp2") {
      circleColor = "orange";
      fillColor = "#fed8b1";
    } else if (this.state.type === "temp3") {
      circleColor = "yellow";
      fillColor = "#ffff66";
    } else if (this.state.type === "temp4") {
      circleColor = "green";
      fillColor = "lightgreen";
    } else if (this.state.type === "temp5") {
      circleColor = "blue";
      fillColor = "skyblue";
    }
    var circle = new kakao.maps.Circle({
      center: center, // 원의 중심좌표 입니다
      radius: this.state.r, // 미터 단위의 원의 반지름입니다
      strokeWeight: 3, // 선의 두께입니다
      strokeColor: circleColor, // 선의 색깔입니다
      strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
      strokeStyle: "solid", // 선의 스타일 입니다
      fillColor: fillColor, // 채우기 색깔입니다
      fillOpacity: 0.6, // 채우기 불투명도 입니다
    });

    kakao.maps.event.addListener(circle, "mouseover", function () {
      circle.setOptions({ fillColor: circleColor });
    });
    kakao.maps.event.addListener(circle, "mouseout", function () {
      circle.setOptions({ fillColor: fillColor });
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
      radius: pCount / 10, // 미터 단위의 원의 반지름입니다
      strokeWeight: 1, // 선의 두께입니다
      strokeColor: "purple", // 선의 색깔입니다
      strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
      strokeStyle: "solid", // 선의 스타일 입니다
      fillColor: "purple", // 채우기 색깔입니다
      fillOpacity: 0.7, // 채우기 불투명도 입니다
    });
    kakao.maps.event.addListener(c, "mouseover", function () {
      c.setOptions({ fillColor: "#CBC3E3" });
    });
    kakao.maps.event.addListener(c, "mouseout", function () {
      c.setOptions({ fillColor: "purple" });
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
    console.log(e);
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
      target = Object.values(this.state.bus[key])[0][index]["circle"];
    }
    if (type === "bus") {
      kakao.maps.event.trigger(
        target,
        e.type,
        e.type === "click" ? "trigger" : null
      );
    } else {
      kakao.maps.event.trigger(
        target,
        e.type,
        e.type === "click" ? "trigger" : null
      );
    }
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
      />
    );
  }
}
