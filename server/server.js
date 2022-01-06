const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const db = require("./config/db");
app.get("/products/:bus/:date/:onoff/:route", (req, res) => {
  var bus = req.params.bus;
  var date = req.params.date;
  if (date === "weekday") {
    date = "0";
  } else if (date === "weekend") {
    date = "1";
  } else {
    date = "9";
  }
  var sql = `select * from AVG_BY_MONTH201907 where BUS_ROUTE_NM = ? and weekend = ?`;
  db.query(sql, [bus, date], (err, data) => {
    if (!err) res.send({ products: data });
    else res.send(err);
  });
});
app.get("/around/:latitude/:longitude/:distance", (req, res) => {
  var latitude = req.params.latitude;
  var longitude = req.params.longitude;
  var distance = req.params.distance;
  var sql = `select *
  from
  (SELECT *,( 6371 * acos( cos( radians( ? ) ) * cos( radians( LOC_X) ) * cos( radians( LOC_Y ) - radians(?) ) + sin( radians(?) ) * sin( radians(LOC_X) ) ) ) AS distance
  FROM pCountByArsNo) a
  where a.distance<=?`;
  db.query(
    sql,
    [latitude, longitude, latitude, distance / 1000],
    (err, data) => {
      if (!err) res.send({ products: data });
      else res.send(err);
    }
  );
});
app.get("/customer/:latitude/:longitude/:distance", (req, res) => {
  var latitude = req.params.latitude;
  var longitude = req.params.longitude;
  var distance = req.params.distance;
  var sql = `select TRCR_NO
  from
  (SELECT *,( 6371 * acos( cos( radians( ? ) ) * cos( radians( LOC_X) ) * cos( radians( LOC_Y ) - radians(?) ) + sin( radians(?) ) * sin( radians(LOC_X) ) ) ) AS distance
  FROM 201907_TBATSA_USER_22_4_INFO2) a
  where a.distance<=?`;
  db.query(
    sql,
    [latitude, longitude, latitude, distance / 1000],
    (err, data) => {
      if (!err) res.send({ products: data });
      else res.send(err);
    }
  );
});
app.listen(PORT, () => {
  console.log(`Server On : http://localhost:${PORT}/`);
});
