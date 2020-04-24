var router = require ('express').Router ();

router.use ('/ringfit', require ('./ringfit'));
router.use ('/social', require ('./social'));

module.exports = router;
