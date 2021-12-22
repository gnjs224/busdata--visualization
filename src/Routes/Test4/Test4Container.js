/*global kakao*/
import React from "react";
import Test4Presenter from "./Test4Presenter";
import axios from "axios";
var map;
var linePath = [];
var circleColor = "";
// eslint-disable-next-line
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
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
    for (var i = 1; i < 6; i++) {
      axios
        .get("/products/temp" + i + "/ALL/ALL/ALL")
        .then((res) => {
          this.addCircle(res);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }
  addCircle(res) {
    var big = res.data.products;
    // console.log(big);

    // while (circles.length !== 0) {
    //   circles.pop().setMap(null);
    // }
    // while (bigCircles.length !== 0) {
    //   bigCircles.pop().setMap(null);
    // }
    // this.setState({ bus: [], subway: [], sum: 0 });
    linePath = [];
    for (var i = 0; i < big.length; i++) {
      this.addBig(big[i]);
      // console.log(result);
    }
    console.log(linePath);
    if (big[0]["BUS_ROUTE_NM"] === "temp5") {
      console.log("asd");
      linePath.unshift(linePath.pop());
    }
    console.log(linePath);
    var polyline = new kakao.maps.Polyline({
      path: linePath, // 선을 구성하는 좌표배열 입니다
      strokeWeight: 5, // 선의 두께 입니다
      strokeColor: circleColor, // 선의 색깔입니다
      strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
      strokeStyle: "dashed", // 선의 스타일입니다
    });
    polyline.setMap(map);
    // console.log(sum, bus, subway);
    // this.setState({
    //   bus: bus,
    //   subway: subway,
    //   sum: sum,
    // });
    // console.log(big);
  }
  async addBig(big) {
    // console.log(big);
    const center = new kakao.maps.LatLng(big["LOC_X"], big["LOC_Y"]);

    switch (big["BUS_ROUTE_NM"]) {
      case "temp1":
        circleColor = "#ff1a1a";
        break;
      case "temp2":
        circleColor = "#ff751a";
        break;
      case "temp3":
        circleColor = "#ffff1a";
        break;
      case "temp4":
        circleColor = "#1aff1a";
        break;
      case "temp5":
        circleColor = "#1a1aff";
        break;
      default:
        break;
    }
    if (this.state.type === "temp1") {
      circleColor = "#ff1a1a";
    } else if (this.state.type === "temp2") {
      circleColor = "#ff751a";
    } else if (this.state.type === "temp3") {
      circleColor = "#ffff1a";
    } else if (this.state.type === "temp4") {
      circleColor = "#1aff1a";
    } else if (this.state.type === "temp5") {
      circleColor = "#1a1aff";
    }
    var circle = new kakao.maps.Circle({
      center: center, // 원의 중심좌표 입니다
      radius: 500, // 미터 단위의 원의 반지름입니다
      strokeWeight: 3, // 선의 두께입니다
      strokeColor: "white", // 선의 색깔입니다
      strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
      strokeStyle: "solid", // 선의 스타일 입니다
      fillColor: circleColor, // 채우기 색깔입니다
      fillOpacity: 0.8, // 채우기 불투명도 입니다
      zIndex: 0,
    });
    linePath.push(center);
    circle.setMap(map);
  }

  render() {
    // eslint-disable-next-line
    const {} = this.state;
    return <Test4Presenter />;
  }
}
