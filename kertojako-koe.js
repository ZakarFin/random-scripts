
var args = [];
if(typeof process !== "undefined") {
    args = process.argv.slice(2);
}
var totalNumber = 40;
var min = 0;
var max = 10;

if(args.length) {
    try {
        totalNumber = parseInt(args[0], 10) || totalNumber;
    } catch(err) {
        // ignored
    }
    try {
        min = parseInt(args[1], 10) || min;
    } catch(err) {
        // ignored
    }
    try {
        max = parseInt(args[2], 10) || max;
    } catch(err) {
        // ignored
    }
}
generateCalcs();

function getRandom(min, max) {
    return Math.floor((Math.random() * max) + min);
}

function getPair(min, max) {
    return [getRandom(min, max), getRandom(min, max)];
}

function generateCalcs() {
    for(var i = 0; i < totalNumber; ++i) {
        var pair = getPair(min, max);
        var chance = Math.random();
        if(chance < 0.3 || pair[0] === 0) {
            console.log(pair[0] + " x " + pair[1] + " = ");
        } else {
            var multip = pair[0] * pair[1]
            if(chance > 0.7 && pair[0] != 1) {
                // Introduce jakojäännös
                multip += getRandom(1, pair[0] - 1);
            }
            //pair = pair.sort(function(a, b) { return a > b; });
            console.log(multip + " : " + pair[0] + " = ");
            if(multip % pair[0] !== 0) {
                console.log(" - Jakojäännös = ");
            }
        }
    }
}
