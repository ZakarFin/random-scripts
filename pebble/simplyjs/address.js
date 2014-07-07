simply.text({
    title: 'Address',
    body: 'Resolving... please wait'
});
simply.scrollable(true);
var startedAt = timestamp();
locateUser(true);

simply.on('singleClick', function(e) {
    if(e.button === 'select') {
        simply.body('Resolving... please wait');
        locateUser(true);
    }
});

function locateUser(highAccuracy) {
    var opts = {
        enableHighAccuracy: !!highAccuracy,
        timeout: 10000,
        maximumAge: 0
    };
    navigator.geolocation.getCurrentPosition(function(pos) {
        var coords = pos.coords;
        var reverseGeocodeUrl = 'http://open.mapquestapi.com/nominatim/v1/reverse.php?' +
            'format=json' +
            '&lat=' + coords.latitude +
            '&lon=' + coords.longitude;
        ajax({
            url: reverseGeocodeUrl,
            type: 'json'
        }, showResults, ajaxErrorHandler);
    }, function(err) {
        errorHandler(err, true);
    }, opts);
}

function showResults(data) {
    var msg = '';
    for(var key in data.address) {
        msg = msg + key + ': ' + data.address[key] + '\n';
    }
    simply.body(msg);
}

function locationErrorHandler(err, wasHighAccuracy) {
    if(wasHighAccuracy) {
        // highaccuracy fails indoors and such
        simply.body('Error resolving accurate location');
        locateUser(false)
    }
    else {
        simply.body('Error resolving location');
        notifyUser();
    }
}
function ajaxErrorHandler(err) {
    simply.body('Error resolving address');
    notifyUser();
}

function notifyUser() {
    if(timestamp() > startedAt + 5000) {
        // more that 5 seconds elapsed, user isn't propably looking anymore
        simply.vibe();
    }
}

function timestamp() {
    return new Date().getTime();
}