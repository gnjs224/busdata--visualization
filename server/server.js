const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const db = require("./config/db");
app.get("/products/:bus", (req, res) => {
  console.log(req.params.bus);
  // let bus = req.query.bus;
  // console.log(bus);
  // let date = req.body.date;
  // let onoff = req.body.onoff;
  // let route = req.body.route;
  db.query(
    `select * from NUM_BY_HOUR201907 where BUS_ROUTE_NM = ` + bus,
    (err, data) => {
      if (!err) res.send({ products: data });
      else res.send(err);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server On : http://localhost:${PORT}/`);
});
