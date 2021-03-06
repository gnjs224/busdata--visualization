import React from "react";
import styled from "styled-components";
import { Slider, Box } from "@material-ui/core";
import Header from "../../Components/Header";
const Key = styled.span`
  font-weight: bold;
  margin-left: 20px;
`;
function valueLabelFormat(value) {
  if (value > 23) {
    value -= 24;
  }
  return value + "시";
}
const TimeSlider = (props) => {
  const [value, setValue] = React.useState([4, 28]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (value !== newValue) {
      props.setTime(newValue);
    }
  };
  return (
    <div>
      <Box sx={{ width: "80%", margin: "0 auto" }}>
        <Slider
          getAriaLabel={() => "Temperature range"}
          value={value}
          onChange={handleChange}
          valueLabelDisplay="on"
          marks
          step={1}
          getAriaValueText={valueLabelFormat}
          valueLabelFormat={valueLabelFormat}
          min={4}
          max={28}
        />
      </Box>
    </div>
  );
};
const TestPresenter = (props) => {
  return (
    <>
      <Header type={1} />
      <br />
      <div style={{ height: "91vh", textAlign: "center" }}>
        <div style={{ marginTop: "50px", marginBottom: "10px" }}>
          <TimeSlider setTime={props.setTime} getTime={props.getTime} />
          <Key>BUS:</Key>
          <span class="bus" onChange={props.setBus}>
            <input
              type="radio"
              id="301"
              name="bus"
              value="301"
              checked={props.getBus() === "301"}
            />
            <label for="301">301</label>
            <input type="radio" id="401" name="bus" value="401" />
            <label for="401">401</label>
            <input type="radio" id="3011" name="bus" value="3011" />
            <label for="3011">3011</label>
            <input type="radio" id="temp1" name="bus" value="temp1" />
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

          <span class="date" onChange={props.setDate}>
            <Key>WEEK:</Key>
            <input
              type="radio"
              id="ALL1"
              name="date"
              value="ALL"
              checked={props.getDate() === "ALL"}
            />
            <label for="ALL1">전체</label>
            <input type="radio" id="weekday" name="date" value="weekday" />
            <label for="weekday">주중</label>
            <input type="radio" id="weekend" name="date" value="weekend" />
            <label for="weekend">주말</label>
          </span>
          <span class="onoff" onChange={props.setOnoff}>
            <Key>ON/OFF:</Key>
            <input
              type="radio"
              id="ALL2"
              name="onoff"
              value="ALL"
              checked={props.getOnoff() === "ALL"}
            />
            <label for="ALL2">전체</label>
            <input type="radio" id="TBR" name="onoff" value="TBR" />
            <label for="TBR">승차</label>
            <input type="radio" id="TBA" name="onoff" value="TBA" />
            <label for="TBA">하차</label>
          </span>
          <span class="route" onChange={props.setRoute}>
            <Key>ASC/DESC:</Key>
            <input
              type="radio"
              id="ALL3"
              name="route"
              value="ALL"
              checked={props.getRoute() === "ALL"}
            />
            <label for="ALL3">전체</label>
            <input type="radio" id="ASC" name="route" value="ASC" />
            <label for="ASC">상행</label>
            <input type="radio" id="DESC" name="route" value="DESC" />
            <label for="DESC">하행</label>
          </span>
        </div>

        <div id="map" style={{ width: "100%", height: "90%" }}></div>
      </div>
    </>
  );
};
export default TestPresenter;
