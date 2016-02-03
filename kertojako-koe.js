
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

function generateCalcs() {
    for(var i = 0; i < totalNumber; ++i) {
        var first = getRandom(min, max);
        var chance = Math.random();
        var calcNum = i +1;
        if(chance < 0.3 || first === 0) {
            console.log(calcNum + ") " + first + " x " + getRandom(min, max) + " = ");
        } else {
            var multip = first * getRandom(min, max);
            if(chance > 0.7 && first > 1) {
                // Introduce jakojäännös
                multip += getRandom(1, first - 1);
            }
            console.log(calcNum + ") " + multip + " : " + first + " = ");
            if(multip % first !== 0) {
                console.log("   Jakojäännös = ");
            }
        }
    }
}
