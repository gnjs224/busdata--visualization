/*global kakao*/
import React from "react";
import Test2Presenter from "./Test2Presenter";
import "./style.css";
import axios from "axios";
var map;
var circles = [];
var infowindow = new kakao.maps.InfoWindow({ removable: true });
// eslint-disable-next-line
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { subway: [], bus: [], sum: 0 };
  }
  async componentDidMount() {
    console.log("didmount");
    var container = document.getElementById("map");
    var options = {
      center: new kakao.maps.LatLng(37.541, 126.986),
      level: 8,
    };
    // eslint-disable-next-line
    map = new kakao.maps.Map(container, options);

    var center = null;
    var drawingFlag = false; // 선이 그려지고 있는 상태를 가지고 있을 변수입니다
    var moveLine; // 선이 그려지고 있을때 마우스 움직임에 따라 그려질 선 객체 입니다
    var clickLine; // 마우스로 클릭한 좌표로 그려질 선 객체입니다
    var distanceOverlay; // 선의 거리정보를 표시할 커스텀오버레이 입니다
    var dots = {}; // 선이 그려지고 있을때 클릭할 때마다 클릭 지점과 거리를 표시하는 커스텀 오버레이 배열입니다.
    // 지도에 클릭 이벤트를 등록합니다
    // 지도를 클릭하면 선 그리기가 시작됩니다 그려진 선이 있으면 지우고 다시 그립니다
    kakao.maps.event.addListener(map, "rightclick", function (mouseEvent) {
      // 마우스로 클릭한 위치입니다
      var clickPosition = mouseEvent.latLng;

      // 지도 클릭이벤트가 발생했는데 선을 그리고있는 상태가 아니면
      if (!drawingFlag) {
        map.setCursor("none");
        while (circles.length !== 0) {
          circles.pop().setMap(null);
        }
        // 상태를 true로, 선이 그리고있는 상태로 변경합니다
        drawingFlag = true;
        center = clickPosition;
        // 지도 위에 선이 표시되고 있다면 지도에서 제거합니다
        deleteClickLine();

        // 지도 위에 커스텀오버레이가 표시되고 있다면 지도에서 제거합니다
        deleteDistnce();

        // 지도 위에 선을 그리기 위해 클릭한 지점과 해당 지점의 거리정보가 표시되고 있다면 지도에서 제거합니다
        deleteCircleDot();

        // 클릭한 위치를 기준으로 선을 생성하고 지도위에 표시합니다
        clickLine = new kakao.maps.Polyline({
          map: map, // 선을 표시할 지도입니다
          path: [clickPosition], // 선을 구성하는 좌표 배열입니다 클릭한 위치를 넣어줍니다
          strokeWeight: 3, // 선의 두께입니다
          strokeColor: "#db4040", // 선의 색깔입니다
          strokeOpacity: 1, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
          strokeStyle: "solid", // 선의 스타일입니다
        });

        // 선이 그려지고 있을 때 마우스 움직임에 따라 선이 그려질 위치를 표시할 선을 생성합니다
        moveLine = new kakao.maps.Polyline({
          strokeWeight: 3, // 선의 두께입니다
          strokeColor: "#db4040", // 선의 색깔입니다
          strokeOpacity: 0.5, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
          strokeStyle: "solid", // 선의 스타일입니다
        });
        displayCircleDot(clickPosition, 0);
      } else {
        map.setCursor("grab");
        // 선이 그려지고 있는 상태이면
        // 그려지고 있는 선의 좌표 배열을 얻어옵니다
        var path = clickLine.getPath();

        // 좌표 배열에 클릭한 위치를 추가합니다
        path.push(clickPosition);

        // 다시 선에 좌표 배열을 설정하여 클릭 위치까지 선을 그리도록 설정합니다
        clickLine.setPath(path);

        moveLine.setMap(null);
        moveLine = null;
        drawingFlag = false;
        deleteDistnce();
        var distance = Math.round(clickLine.getLength());
        displayCircleDot(clickPosition, distance);
        drawCircle(center, distance);
      }
    });

    // 지도에 마우스무브 이벤트를 등록합니다
    // 선을 그리고있는 상태에서 마우스무브 이벤트가 발생하면 그려질 선의 위치를 동적으로 보여주도록 합니다
    kakao.maps.event.addListener(map, "mousemove", function (mouseEvent) {
      // 지도 마우스무브 이벤트가 발생했는데 선을 그리고있는 상태이면
      if (drawingFlag) {
        // 마우스 커서의 현재 위치를 얻어옵니다
        var mousePosition = mouseEvent.latLng;

        // 마우스 클릭으로 그려진 선의 좌표 배열을 얻어옵니다
        var path = clickLine.getPath();

        // 마우스 클릭으로 그려진 마지막 좌표와 마우스 커서 위치의 좌표로 선을 표시합니다
        var movepath = [path[path.length - 1], mousePosition];
        moveLine.setPath(movepath);
        moveLine.setMap(map);
        var distance = Math.round(clickLine.getLength() + moveLine.getLength()), // 선의 총 거리를 계산합니다
          content =
            '<div class="dotOverlay distanceInfo">거리 <span class="number">' +
            distance.toLocaleString("ko-KR") +
            "</span>m</div>"; // 커스텀오버레이에 추가될 내용입니다

        // 거리정보를 지도에 표시합니다
        mousePosition["La"] -= 0.00034;
        mousePosition["Ma"] += 0.00025;
        showDistance(content, mousePosition);
      }
    });

    // 클릭으로 그려진 선을 지도에서 제거하는 함수입니다
    const deleteClickLine = () => {
      if (clickLine) {
        clickLine.setMap(null);
        clickLine = null;
      }
    };

    // 마우스 드래그로 그려지고 있는 선의 총거리 정보를 표시하거
    // 마우스 오른쪽 클릭으로 선 그리가 종료됐을 때 선의 정보를 표시하는 커스텀 오버레이를 생성하고 지도에 표시하는 함수입니다
    function showDistance(content, position) {
      if (distanceOverlay) {
        // 커스텀오버레이가 생성된 상태이면

        // 커스텀 오버레이의 위치와 표시할 내용을 설정합니다
        distanceOverlay.setPosition(position);
        distanceOverlay.setContent(content);
      } else {
        // 커스텀 오버레이가 생성되지 않은 상태이면

        // 커스텀 오버레이를 생성하고 지도에 표시합니다
        distanceOverlay = new kakao.maps.CustomOverlay({
          map: map, // 커스텀오버레이를 표시할 지도입니다
          content: content, // 커스텀오버레이에 표시할 내용입니다
          position: position, // 커스텀오버레이를 표시할 위치입니다.
          xAnchor: 0,
          yAnchor: 0,
          zIndex: 3,
        });
      }
    }

    // 그려지고 있는 선의 총거리 정보와
    // 선 그리가 종료됐을 때 선의 정보를 표시하는 커스텀 오버레이를 삭제하는 함수입니다
    function deleteDistnce() {
      if (distanceOverlay) {
        distanceOverlay.setMap(null);
        distanceOverlay = null;
      }
    }
    function displayCircleDot(position, distance) {
      // 클릭 지점을 표시할 빨간 동그라미 커스텀오버레이를 생성합니다
      var circleOverlay = new kakao.maps.CustomOverlay({
        content: '<span class="dot"></span>',
        position: position,
        zIndex: -1,
      });

      // 지도에 표시합니다
      circleOverlay.setMap(map);

      if (distance > 0) {
        // 클릭한 지점까지의 그려진 선의 총 거리를 표시할 커스텀 오버레이를 생성합니다
        var distanceOverlay = new kakao.maps.CustomOverlay({
          content:
            '<div class="dotOverlay">거리 <span class="number">' +
            distance.toLocaleString("ko-KR") +
            "</span>m</div>",
          position: position,
          yAnchor: 1,
          zIndex: -1,
        });

        // 지도에 표시합니다
        distanceOverlay.setMap(map);
      }

      // 배열에 추가합니다
      dots.push({ circle: circleOverlay, distance: distanceOverlay });
    }
    // 클릭 지점에 대한 정보 (동그라미와 클릭 지점까지의 총거리)를 지도에서 모두 제거하는 함수입니다
    function deleteCircleDot() {
      var i;

      for (i = 0; i < dots.length; i++) {
        if (dots[i].circle) {
          dots[i].circle.setMap(null);
        }

        if (dots[i].distance) {
          dots[i].distance.setMap(null);
        }
      }

      dots = [];
    }
    const drawCircle = (center, distance) => {
      axios
        .get("/around/" + center["Ma"] + "/" + center["La"] + "/" + distance)
        .then(async (res) => {
          // console.log(res.data.products);
          var data = res.data.products;
          var bus = [];
          var subway = [];
          for (var i = 0; i < data.length; i++) {
            const locX = data[i]["LOC_X"];
            const locY = data[i]["LOC_Y"];
            const pCount = data[i]["pCount"];
            const stnId = data[i]["STN_ID"];
            const stnNm = data[i]["STN_NM"];
            const arsNo = data[i]["ARS_NO"];
            const c = this.addCircle(locX, locY, pCount, stnNm, arsNo, stnId);
            if (stnId.length === 4) {
              subway.push({
                stnNm: stnNm,
                arsNo: arsNo,
                pCount: pCount,
                circle: c,
              });
            } else {
              bus.push({
                stnNm: stnNm,
                arsNo: arsNo,
                pCount: pCount,
                circle: c,
              });
            }
          }
          var circle = new kakao.maps.Circle({
            center: center, // 원의 중심좌표 입니다
            radius: distance, // 미터 단위의 원의 반지름입니다
            strokeWeight: 3, // 선의 두께입니다
            strokeColor: "green", //"#75B8FA", // 선의 색깔입니다
            strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            strokeStyle: "solid", // 선의 스타일 입니다
            fillColor: "lightgreen", //"#CFE7FF", // 채우기 색깔입니다
            fillOpacity: 0.6, // 채우기 불투명도 입니다
            zIndex: 0,
          });
          kakao.maps.event.addListener(circle, "mouseover", function () {
            circle.setOptions({ fillColor: "green" });
            map.setCursor("pointer");
          });
          kakao.maps.event.addListener(circle, "mouseout", function () {
            circle.setOptions({ fillColor: "lightgreen" });
            map.setCursor("grab");
          });
          var sum = 0;

          await axios
            .get(
              "/customer/" + center["Ma"] + "/" + center["La"] + "/" + distance
            )
            .then((res) => {
              const set = new Set();
              const data = res.data.products;
              for (var d in data) {
                set.add(data[d]["TRCR_NO"]);
              }
              sum = set.size;
              console.log(sum, res.data.products);
            })
            .catch((e) => {
              console.log(e);
            });
          // console.log(sum);
          kakao.maps.event.addListener(circle, "click", function (mouseEvent) {
            var content =
              "<div class = 'window'><span class = 'title'> 주거 정류장 수</span> <br>지하철: " +
              subway.length +
              "<br>버스: " +
              bus.length +
              "<br><br> <span class = 'title'> 잠재고객 수 </span><br>" +
              (sum * 10).toLocaleString("ko-KR") +
              "</div>";
            infowindow.setContent(content);
            if (mouseEvent === "trigger") {
              infowindow.setPosition(circle.getPosition());
            } else {
              infowindow.setPosition(mouseEvent.latLng);
            }
            infowindow.setMap(map);
          });

          circle.setMap(map);
          circles.push(circle);
          bus.sort(function (a, b) {
            return b["pCount"] - a["pCount"];
          });
          subway.sort(function (a, b) {
            return b["pCount"] - a["pCount"];
          });

          this.setState({ bus: bus, subway: subway, sum: sum });
          // console.log(sum, this.state.sum);
          // console.log(this.state.sum, this.state.bus, this.state.subway);
        })
        .catch((e) => {
          console.log(e);
        });
    };
  }
  //#CBC3E3
  addCircle = (locX, locY, pCount, stnNm, arsNo, stnId) => {
    var c = new kakao.maps.Circle({
      center: new kakao.maps.LatLng(locX, locY), // 원의 중심좌표 입니다
      radius: pCount / 20, // 미터 단위의 원의 반지름입니다
      strokeWeight: 1, // 선의 두께입니다
      strokeColor: "purple", // 선의 색깔입니다
      strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
      strokeStyle: "solid", // 선의 스타일 입니다
      fillColor: "purple", // 채우기 색깔입니다
      fillOpacity: 0.1, // 채우기 불투명도 입니다
      zIndex: 1 / pCount,
    });
    kakao.maps.event.addListener(c, "mouseover", function () {
      c.setOptions({ fillOpacity: 0.5 });
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
  setMap = (v) => {
    var ps = new kakao.maps.services.Places();
    ps.keywordSearch(v, this.placesSearchCB);
  };

  placesSearchCB = (data, status, pagination) => {
    if (status === kakao.maps.services.Status.OK) {
      // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
      // LatLngBounds 객체에 좌표를 추가합니다
      var bounds = new kakao.maps.LatLngBounds();

      for (var i = 0; i < data.length; i++) {
        bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
      }

      // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
      map.setBounds(bounds);
    }
  };
  listClicker = (e) => {
    const index = e.target.dataset.i;
    const type = e.target.dataset.type;
    if (type === "bus") {
      kakao.maps.event.trigger(
        this.state.bus[index]["circle"],
        "click",
        "trigger"
      );
    } else {
      kakao.maps.event.trigger(
        this.state.subway[index]["circle"],
        "click",
        "trigger"
      );
    }
  };
  listOver = (e) => {
    const index = e.target.dataset.i;
    const type = e.target.dataset.type;
    if (type === "bus") {
      kakao.maps.event.trigger(this.state.bus[index]["circle"], "mouseover");
    } else {
      kakao.maps.event.trigger(this.state.subway[index]["circle"], "mouseover");
    }
  };
  listOut = (e) => {
    const index = e.target.dataset.i;
    const type = e.target.dataset.type;
    if (type === "bus") {
      kakao.maps.event.trigger(this.state.bus[index]["circle"], "mouseout");
    } else {
      kakao.maps.event.trigger(this.state.subway[index]["circle"], "mouseout");
    }
  };
  render() {
    const { subway, bus, sum } = this.state;
    return (
      <Test2Presenter
        setMap={this.setMap}
        subway={subway}
        bus={bus}
        sum={sum}
        listClicker={this.listClicker}
        listOut={this.listOut}
        listOver={this.listOver}
      />
    );
  }
}
