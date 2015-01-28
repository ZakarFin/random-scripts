(function (global, factory) {
    if (typeof define === "function" && define.amd) define(["lodash"], factory);
    else if (typeof module === "object")  module.exports = factory;
    else {
        // lodash expected as global "_"
        global.ClassDefinition = factory(_);
    }
}(this, function(_) {
    var _alreadyInArray = function(list, test) {
        return _.find(list, function(existing) { return test === existing; });
    };
    var ClassDefinition = function(registry, name) {
        // if Registry string -> assume first param is name and undeclare registry
        if(typeof registry === 'string') {
            // maybe check registry is an object with definition()?
            name = registry;
            registry = null;
        }
        var _constructors = [];
        var _body = {};
        var _parents = [];
        var _types = [];
        var _builder;
        var _registry = function(name, value) {
            // register change in def
            if(!registry) {
                if(!value) {
                    throw new Error('Registry not available. Cannot load definition for ' + name);
                }
                // updates die silently when registry not available
                return;
            }
            return registry.definition(name, value);
        };
        return {
            getName : function() {
                return name;
            },
            addConstructor : function(func, isInherited) {
                if(!func) {
                    return this;
                }
                // reject existing constructor if already added
                // -> this moves the constructor to correct place based on inheritance order
                _constructors = _.reject(_constructors, function(n) { return n === func; });

                if(isInherited) {
                    _constructors.unshift(func);
                }
                else {
                    _constructors.push(func);
                }
                // register change in def
                _registry(this.getName(), this);
                return this;
            },
            getConstructors : function() {
                return _constructors;
            },
            addType : function(type) {
                if(_alreadyInArray(_types, type)) {
                    return this;
                }
                _types.push(type);
                // register change in def
                _registry(this.getName(), this);
                if(registry) {
                    // register as typed definition
                    registry.type(type, this);
                }
                return this;
            },
            getTypes: function() {
                return _types;
            },
            getProperties: function() {
                return _body;
            },
            addProperty : function(name, value, isInherited) {
                if(!_body[name] || !isInherited) {
                    _body[name] = value;
                    // register change in def
                    _registry(this.getName(), this);
                }
                return this;
            },
            getParents : function() {
                return _parents;
            },
            inherit : function(parent, obj) {
                var me = obj || this;
                // get parent definition
                var def = _registry(parent);
                if(!def) {
                    // TODO: also check for circular reference?
                    return this;
                }
                _parents.push(parent);
                var isInherited = true;
                /*
                console.log(me.getName() + ' inheriting ' + def.getName() 
                    + ' with contructor count of ' + def.getConstructors().length);
                */
                _.each(def.getConstructors(), function(func) {
                    me.addConstructor(func, isInherited);
                });
                _.each(def.getTypes(), function(func) {
                    me.addType(func, isInherited);
                });
                _.forIn(def.getProperties(), function(value, key) {
                    me.addProperty(key, value, isInherited);
                });
                // this might not be necessary...
                _.each(def.getParents(), function(elder) {
                    me.inherit(elder, me);
                });

                // register change in def
                _registry(me.getName(), me);
                return this;
            },
            create : function() {
                var def = this,
                    instance = _builder;
                if(_builder) {
                    return new _builder(arguments);
                }
                _builder = function() {
                    var me = this,
                        constArgs = arguments;
                    //me.__name = def.getName();
                    _.each(def.getConstructors(), function(func) {
                        //try {
                            func.apply(me, constArgs);
                        //} catch(e) { console.log(e) }
                    });
                    // maybe give properties for prototype?
                    _.forIn(def.getProperties(), function(value, key) {
                        me[key] = value;
                    });

                };
                return new _builder(arguments);
            }
        };
    };
    return ClassDefinition;
}));