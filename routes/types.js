 var
express = require('express'),
router = express.Router(),
firebase = require('firebase'),
FbRef = firebase.database().ref();

router.get('*', function( req, res, next){
	//Check Authentication
	if(firebase.auth().currentUser == null){
		res.redirect('/users/login');
	}
	next()
});


// Home Page
router.get('/', function(req, res, next){
	var typeRef = FbRef.child('type');

	typeRef.once('value', function(snapshot){
		var types = [];
		snapshot.forEach(function(childSnapshot){
			var key = childSnapshot.key;
			var childData = childSnapshot.val();
			if(childData.uid == firebase.auth().currentUser.uid){
			types.push({
				id: key,
				name: childData.name
			 });
			}
		});
		res.render('types/index', {types: types});
	});
});



router.get('/add', function(req, res, next){
	res.render('types/add');
});

router.post('/add', function(req, res, next){
	var type = {
		name: req.body.type,
		uid: firebase.auth().currentUser.uid
	};

	var typeRef = FbRef.child("type");
	typeRef.push().set(type);

	req.flash('success_msg', 'Type Saved');
	res.redirect('/types');

});

router.get('/edit/:id', function(req, res, next){
	var id = req.params.id;
	var typeRef = new firebase.database().ref('/type/'+id);

	typeRef.once("value", function(snapshot){
		var type = snapshot.val();
		res.render('types/edit', {type: type, id: id});
	});
});

router.post('/edit/:id', function(req, res, next){
	var id =req.params.id;
	var type = req.body.type;
	var typeRef = new firebase.database().ref('/type/'+id);

	typeRef.update({
		name: type
	});

	res.redirect('/types');
});

router.delete('/delete/:id', function(req, res, next){
	var id =req.params.id;
	var typeRef = new firebase.database().ref('/type/'+id);

	typeRef.remove();
	req.flash('success_msg', 'Type Deleted');
	res.sendStatus(200);
});


module.exports = router;
