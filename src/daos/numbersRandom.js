const express = require('express');
const { fork } = require('child_process');
const router = express.Router();

router.get('/', (req, res) => {
    let cant = parseInt(req.query.cant);
    if (!cant) cant = 1e8;
    const randomFork = fork('src/daos/randomFork.js');
    randomFork.send(cant);
    randomFork.on('message', (nums) => {
        res.send(nums);
    });
});

module.exports = router;