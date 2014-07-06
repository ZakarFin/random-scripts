
simply.text({ title: 'Address', body: 'Resolving... please wait' });

function showResults(data) {
	var msg = data.address.road + '\n' + 
		data.address.suburb + ' / ' + data.address.city_district + '\n' + 
		data.address.postcode + '  ' + data.address.city;
	simply.body(msg);
    simply.scrollable(true);
}

navigator.geolocation.getCurrentPosition(function(pos) {
  var coords = pos.coords;
//&json_callback=showResults
  var reverseGeocodeUrl = 'http://open.mapquestapi.com/nominatim/v1/reverse.php?' +
  'format=json&units=metric' + 
  '&lat=' + coords.latitude + 
  '&lon=' + coords.longitude;
  ajax({ url: reverseGeocodeUrl, type: 'json' }, showResults);
},function(err) {
	simply.body('Error resolving location');
}, {
  enableHighAccuracy: true,
  timeout: 60000,
  maximumAge: 0
});