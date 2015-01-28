(function (global, factory) {
    if (typeof define === "function" && define.amd) define(["lodash"], factory);
    else if (typeof module === "object")  module.exports = factory;
    else {
        // lodash expected as global "_"
        global.Storage = factory(_);
    }
}(( typeof window === 'object' && window ) || this, function(_) {

    var setterGetter = function setterGetterFn(collection, key, value, defaultValue, validator, append) {
        if(!collection) {
            return;
        }
        // setter
        if(key && value) {
            var currentValue = collection[key] = collection[key] || defaultValue;
            // validate if validator is provided, pass is value and previous value
            if(typeof validator === 'function' && !validator(value, currentValue)) {
                return false;
            }
            // handle lists
            if(_.isArray(currentValue)) {
                if(append) {
                    currentValue.push(value);
                }
                else {
                    collection[key] = value;
                }
            }
            // handle non objects
            else if (!_.isObject(currentValue)) {
                if(append && !_.isObject(value)) {
                    collection[key] = (currentValue || defaultValue || '') + value;
                }
                else {
                    collection[key] = value;
                }
            }
            // current value is object, but we don't try to append
            else if(!append) {
                collection[key] = value;
            }
            else {
                // current value is object and we should append, can't handle this
                return false;
            }
            return true;
        }
        // getters
        if(!key) {
            // get registered keys
            var result = [];
            _.forIn(collection, function(_value, _key) {
                result.push(_key);
            });
            return result;
        }
        else {
            // return values registered for name
            return collection[key] || defaultValue;
        }
    };
    var exists = function(list, test) {
        return _.isArray(list) && _.find(list, function(existing) { return test === existing; });
    };
    /*
    Returns an object with given methodName (defaults to 'data' if missing -> uses options as first param)
    options is an (optional) object with keys:
    - defaultValue : value to use if key doesn't have a value
    - validator : function that will receive the value to be inserted and the current value as params
    - allowDuplicates : boolean with handling if value is a list
    
    Returns an object with functions: 
    - reset(key) : removes value from the key or resets the whole storage if omitted
    - exists(list, value) : returns true if list already includes value
    - data(key, value, blnAppend) : 
        - the actual method name can be overridden with constructor arg (defaults to data)
        - blnAppend as true will append the value to a list if current value is list or concatenate
          the value to the current one if not
    */
    var Storage = function(methodName, options) {
        // normalize params
        if(typeof methodName !== 'string') {
            options = methodName;
            methodName = null;
        }
        methodName = methodName || "data";
        if(typeof options !== 'object') {
            options = {};
        }
        if(options.allowDuplicates !== true) {
            var validator = function(value, currentValue) {
                var isOk = !exists(currentValue, value);
                if(typeof options.validator === 'function') {
                    isOk = isOk && options.validator(value, currentValue);
                }
                return isOk;
            };
        }

        var _collection = {};
        var _me = {
            reset : function(key) {
                if(!key) {
                    // do we need to loop and delete here to save memory? 
                    _collection = {};
                }
                else {
                    delete _collection[key];
                }
            }
        };
        _me[methodName] = function(key, value, append) {
            return setterGetter(_collection, key, value, options.defaultValue, validator, !!append);
        };
        return _me;
    };
    return Storage;
}));