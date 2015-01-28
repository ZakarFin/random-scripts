(function (global, factory) {
    if (typeof define === "function" && define.amd) define(["lodash", "./storage"], factory);
    else if (typeof module === "object")  module.exports = factory;
    else {
        // lodash expected as global "_"
        global.EventBus = factory(_);
    }
}(( typeof window === 'object' && window ) || this, function(_, Storage) {

    var EventBus = function() {
        var store = new Storage("subscribers", {
            validator : function(value) {
                // only allow functions to be stored as handlers
                return typeof value === 'function';
            },
            defaultValue : []
        });
        return {
            "on" : function(event, handlerFn) {
                return store.subscribers(event, handlerFn, true);
            },
            "off" : function(event, handlerFn) {
                var currentSubs = store.subscribers(event);
                // remove if handlerFn found in currentSubs
                var success = false;
                for (n = 0; n < currentSubs.length; n++) {
                    if (currentSubs[n] === handlerFn) {
                        currentSubs.splice(n, 1);
                        success = true;
                        break;
                    }
                }
                return success;
            },
            "trigger" : function(event, data) {
                var currentSubs = store.subscribers(event);
                var count = 0;
                _.each(currentSubs, function(sub) {
                    sub(data, event);
                    count++;
                });
                return count;
            }
        };
    };
    return EventBus;
}));