const router = require('express').Router();
const apiRoutes = require('./api/');

router.use('/api', apiRoutes);

router.use((req, res) => {
    res.status(404).send('404 error, U did a bad!');
})

module.exports = router;