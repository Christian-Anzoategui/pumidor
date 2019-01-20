const
express = require('express'),
router = express.Router();
firebase = require('firebase'),
FbRef = firebase.database().ref(),
multer = require('multer'),
upload = multer({dest:'./public/images/uploads'});


router.get('*', function( req, res, next){
	//Check Authentication
	if(firebase.auth().currentUser == null){
		res.redirect('/users/login');
	}
	next();
});


router.get('/', function(req, res, next){
		var teasRef = FbRef.child('teas');

	teasRef.once('value', function(snapshot){
		var teas = [];
		snapshot.forEach(function(childSnapshot){
			var key = childSnapshot.key;
			var childData = childSnapshot.val();
			if(childData.uid == firebase.auth().currentUser.uid){
			teas.push({
				id: key,
				type: childData.type,
				yearproduced: childData.yearproduced,
				factory: childData.factory,
				recipe: childData.recipe,
				amount: childData.amount,
				container: childData.container,
				material: childData.material,
				originalsl: childData.originalsl,
				originalsm: childData.originalsm,
				currentstoreddate: childData.currentstoreddate,
				notes: childData.notes,
				rating: childData.rating,
				teaphoto: childData.teaphoto
			  });
			}
		});

		res.render('teas/index', {teas: teas});
	});
});


router.get('/add', function(req, res, next){
	var typeRef = FbRef.child('type');

	typeRef.once('value', function(snapshot){
		var data = [];
		snapshot.forEach(function(childSnapshot){
			var key = childSnapshot.key;
			var childData = childSnapshot.val();
			data.push({
				id: key,
				name: childData.name
			});
		});
		res.render('teas/add', {types: data});
	});
});


router.post('/add', upload.single('teaphoto'),function(req, res, next){
	//Check photo file Upload
	if(req.file){
		console.log('Uploading File...');
		var teaphoto = req.file.filename;
	} else {
		console.log('Nothing Uploaded Boss...');
		var teaphoto = 'noimage.jpg';
	}

	// Build Tea Object
	var tea = {
		type: req.body.type,
		yearproduced: req.body.yearproduced,
		factory: req.body.factory,
		recipe: req.body.recipe,
		amount: req.body.amount,
		container: req.body.container,
		material: req.body.material,
		originalsl: req.body.originalsl,
		originalsm: req.body.originalsm,
		currentstoreddate: req.body.currentstoreddate,
		notes: req.body.notes,
		rating: req.body.rating,
		teaphoto: teaphoto,
		uid: firebase.auth().currentUser.uid
	}
// Create Reference 
//console.log(req.body.material);

var teaRef = FbRef.child('teas');

// Push tea
teaRef.push().set(tea);

req.flash('success_msg','Tea Saved');
res.redirect('/teas')
});

router.get('/details/:id',  function(req, res){
	var id = req.params.id;

	var teaRef = new firebase.database().ref('/teas/'+id);
	
	teaRef.once('value', function(snapshot){
		var tea = snapshot.val();
		res.render('teas/details', {tea: tea, id: id});
	});

});

router.get('/edit/:id', function(req, res, next){
	var id = req.params.id;
	var teaRef = new firebase.database().ref('/teas/'+id);

		var typeRef = FbRef.child('type');

	typeRef.once('value', function(snapshot){
		var teas = [];
		snapshot.forEach(function(childSnapshot){
			var key = childSnapshot.key;
			var childData = childSnapshot.val();
			teas.push({
				id: key,
				name: childData.name
			});
		});
		teaRef.once("value", function(snapshot){
		var tea = snapshot.val();
		res.render('teas/edit', {tea: tea, id: id, types: teas});
	});
	});


});

router.post('/edit/:id', upload.single('teaphoto'), function(req, res, next){
	var id = req.params.id;
	var teaRef = new firebase.database().ref('/teas/'+id);

	// Check File Upload
	if(req.file){
		//Get Tea Photo Filename
		var teaphoto = req.file.filename;

		// Update Tea with Tea Photo
		teaRef.update({
				type: req.body.type,
				yearproduced: req.body.yearproduced,
				factory: req.body.factory,
				recipe: req.body.recipe,
				amount: req.body.amount,
				container: req.body.container,
				material: req.body.material,
				originalsl: req.body.originalsl,
				originalsm: req.body.originalsm,
				currentstoreddate: req.body.currentstoreddate,
				notes: req.body.notes,
				rating: req.body.rating,
				teaphoto: teaphoto

		});
	} else { 
		teaRef.update({
				type: req.body.type,
				yearproduced: req.body.yearproduced,
				factory: req.body.factory,
				recipe: req.body.recipe,
				amount: req.body.amount,
				container: req.body.container,
				material: req.body.material,
				originalsl: req.body.originalsl,
				originalsm: req.body.originalsm,
				currentstoreddate: req.body.currentstoreddate,
				notes: req.body.notes,
				rating: req.body.rating,
		});
	}

	req.flash('success_msg', 'Tea Updated');
	res.redirect('/teas/details/'+id);
});

router.delete('/delete/:id', function(req, res, next){
	var id =req.params.id;
	var teaRef = new firebase.database().ref('/teas/'+id);

	teaRef.remove();
	req.flash('success_msg', 'Tea Deleted');
	res.sendStatus(200);
});


module.exports = router;
