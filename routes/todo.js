var express = require('express');
var router = express.Router();

import ToDo from '../model/to-do'

router
  .route('/todo')
  .post(function (req, res, next) {
    var todoItem = new ToDo({
      itemId: 1,
      item: req.body.item,
      completed: false
    })

    todoItem.save((error, result) => {
      if (error) {
        res.json({
          error: error
        })
      }
      res.json({
        item: todoItem.item
      })
    })
  });

module.exports = router;
