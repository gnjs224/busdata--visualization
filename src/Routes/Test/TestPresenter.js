import React from "react";

const ExercisePresenter = (props) => {
  return (
    <div style={{ background: "skyblue", height: "97vh" }}>
      <div id="map" style={{ width: "100%", height: "80%" }}></div>
      <div class="bus" onChange={props.setBus}>
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
      </div>
      <div class="date" onChange={props.setDate}>
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
      </div>
      <div class="onoff" onChange={props.setOnoff}>
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
      </div>
      <div class="route" onChange={props.setRoute}>
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
      </div>
    </div>
  );
};
export default ExercisePresenter;
