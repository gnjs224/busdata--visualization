const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const db = require("./config/db");
app.get("/products/:bus", (req, res) => {
  console.log(req);
  var bus = req.params.bus;
  console.log(typeof(bus));
  console.log(bus);
  
  var sql = `select * from NUM_BY_HOUR201907 where BUS_ROUTE_NM = ?`;
  // console.log(bus);
  // let date = req.body.date;
  // let onoff = req.body.onoff;
  // let route = req.body.route;
  db.query(sql,bus, (err, data) => {
    if (!err) res.send({ products: data });
    else res.send(err);
  });
});

app.listen(PORT, () => {
  console.log(`Server On : http://localhost:${PORT}/`);
});
