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
    bid: req.body.bid,
    review: req.body.review,
    email: req.body.email, // Email of care Taker
    rating: req.body.rating, // [0, 5] inclusive
    byUser: req.body.byUser, // Email of Pet owners
  };

  // Review table: (rid, review, email, rating, byuser)
  switch (data.reqType) {
    // Only Pet owners can write reviewsreview
    case "createReview":
      pool.query(queries.query.create_review, [data.bid, data.review, data.email, data.rating, data.byUser], (err, result) => {
        if (err) {
          pool.query(queries.query.update_review, [data.bid, data.review, data.email, data.rating, data.byUser], (err, result) => {
            if (err) {
              res.status(400).send(err.stack);
            } else {
              console.log(result);
              res.send(result);
            }
          });
        } else {
          console.log(result);
          res.send(result);
        }
      });
      break;
    // Only Care takers will get reviews.
    case "getReviewsForUser":
      pool.query(queries.query.get_review, [data.email], (err, result) => {
        if (err) {
          res.status(400).send(err.stack);
        } else {
          console.log(result);
          res.send(result);
        }
      });
      break;
    default: break;
  }
});

module.exports = router;
