$(document).ready(function(){
	$('.delete-type').on('click', function(){
		var id = $(this).data('id');
		var url = '/types/delete/'+id;
		if(confirm('Delete Type?')){
			$.ajax({
				url: url,
				type: 'DELETE',
				success: function(result){
					console.log('Deleting type...');
					window.location.href='/types';
				},
				error: function(err){
					console.log(err);
				}
			});
		}
	});

		$('.delete-tea').on('click', function(){
		var id = $(this).data('id');
		var url = '/teas/delete/'+id;
		if(confirm('Delete Tea?')){
			$.ajax({
				url: url,
				type: 'DELETE',
				success: function(result){
					console.log('Deleting tea...');
					window.location.href='/teas';
				},
				error: function(err){
					console.log(err);
				}
			});
		}
	});
});