/*global kakao*/
import React from "react";
import Test3Presenter from "./Test3Presenter";
import axios from "axios";
var map;
var circles = [];
var infowindow = new kakao.maps.InfoWindow({ removable: true });
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
      center: new kakao.maps.LatLng(37.541, 126.986),
      level: 9,
    };
    // eslint-disable-next-line
    map = new kakao.maps.Map(container, options);
  }
  render() {
    const {} = this.state;
    return <Test3Presenter />;
  }
}
