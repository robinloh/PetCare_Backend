var express = require('express');
var router = express.Router();
var queries = require('../models/queries');

const {
  Pool
} = require('pg')
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});


router.post('/', function (req, res, next) {
  const data = {
    reqType: req.body.post,
    email: req.body.email,
    amt: req.body.amt,
  };

  switch (data.reqType) {
    case "getWallet":
      pool.query(queries.query.get_wallet, [data.email], (err, result) => {
        if (err) {
          res.status(400).send(err.stack);
        } else {
          console.log(result);
          res.send(result);
        }
      });
      break;
    case "updateWallet":
      pool.query(queries.query.update_wallet_amt, [data.amt, data.email], (err, result) => {
        if(err) {
          res.status(400).send(err.stack);
        } else {
          console.log(result);
          res.send(result);
        }
      });
    default:
      break;
  }
});

module.exports = router;
