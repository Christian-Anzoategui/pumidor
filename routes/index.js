const
express = require('express'),
router = express.Router();

// Home Page
router.get('/', function(req, res, next){
	res.render('index');
});

module.exports = router;
