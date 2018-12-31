const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('all good');
});
router.get('/info', function (req, res) {
    res.status(200).send({ status: 200, message: 'SC_OK' });
});
router.get('/health', function (req, res) {
    res.status(200).send({ status: 200, message: 'SC_OK' });
});

module.exports = router;
