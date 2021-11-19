const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const db = require("./config/db");
app.get("/products/:bus/:date/:onoff/:route", (req, res) => {
  var bus = req.params.bus;
  var date = req.params.date;
  // var onoff = req.params.onoff;
  // var route = req.params.route;
  // var size = { 301: [1, 50, 100], 401: [1, 50, 99], 3011: [1, 45, 88] };
  // var on = size[bus][0];
  // var off = size[bus][2];
  if (date === "weekday") {
    date = "0";
  } else if (date === "weekend") {
    date = "1";
  } else {
    date = "9";
  }
  // if (route === "ASC") {
  //   off = size[bus][1];
  // } else if (route === "DESC") {
  //   on = size[bus][1] + 1;
  // }
  // console.log(bus, date, onoff, route, on, off);
  var sql = `select * from AVG_BY_MONTH201907 where BUS_ROUTE_NM = ? and weekend = ?`;
  db.query(sql, [bus, date], (err, data) => {
    if (!err) res.send({ products: data });
    else res.send(err);
  });
});

app.listen(PORT, () => {
  console.log(`Server On : http://localhost:${PORT}/`);
});
