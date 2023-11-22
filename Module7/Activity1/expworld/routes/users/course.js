const express = require('express');
const router = express.Router();

router.get('/:courseId/unit/:unitId', function (req, res) {
    res.send('you are studying ' + req.params.courseId + ' unit ' + req.params.unitId);
});

module.exports = router;
