const express = require('express');
const router = express.Router();
const Fuse = require('fuse.js');
const axios = require('axios');

// const userData = JSON.parse(fs.readFileSync('data/users.json', 'utf-8'));

const filterData = (query, data) => {
  return new Promise((resolve, reject) => {
    const fuse = new Fuse(data, {
      keys: ['first_name', 'last_name', 'email'],
      threshold: 0.1,
      findAllMatches: true,
    });

    const results = fuse.search(query).map(result => result.item);
    resolve(results);
  });
}

/* GET users listing. */
router.get('/', function (req, res, next) {
  axios('https://reqres.in/api/users')
    .then(response => {
      // console.log(response.data.data);
      res.render('users', { data: response.data.data });
    })
    .catch(err => {
      res.render('error', {
        message: "Failed to fetch users",
        error: err
      })
    })
});

router.get('/:filter', function(req, res, next) {
  axios('https://reqres.in/api/users')
    .then(response => filterData(req.params.filter, response.data.data))
    .then(filteredData => {
      res.render('users', { data: filteredData })
    })
    .catch(err => {
      res.render('error', {
        message: "Failed to fetch users",
        error: err
      })
    })
});


module.exports = router;
