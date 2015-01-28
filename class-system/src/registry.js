(function (global, factory) {
    if (typeof define === "function" && define.amd) define(["lodash", './class-definition'], factory);
    else if (typeof module === "object")  module.exports = factory;
    else {
        // lodash expected as global "_"
        global.Registry = factory(_, ClassDefinition);
    }
}(this, function(_, ClassDefinition) {

    var _definitions = {};
    var _types = {};
    return {
        definition : function(name, value) {
            if(!name) {
                return null;
            }
            if(!value) {
                return _definitions[name];
            }
            _definitions[name] = value;
        },
        create : function(name, args) {
            if(!name || !_definitions[name]) {
                return null;
            }
            return _definitions[name].create(args);
        },
        define : function(name, constructorFn, methods, metadata) {
            // normalize params - name can be skipped -> shift params
            if(typeof name !== 'string') {
                metata = methods;
                methods = constructorFn;
                constructorFn = name;
                name = undefined;
            }
            // normalize params - construnctor sfunction can be skipped -> shift params
            if(typeof constructorFn === 'object') {
                metadata = methods;
                methods = constructorFn;
                constructorFn = undefined;
            }

            // normalize methods 
            methods = methods || {};
            // normalize metadata
            metadata = metadata || {};
            metadata.extend = metadata.extend || [];
            metadata.type = metadata.type || [];
            // allow string type extend
            if(typeof metadata.extend === 'string') {
                metadata.extend = [metadata.extend];
            }
            // allow string type protocol
            if(typeof metadata.protocol === 'string') {
                metadata.type = [metadata.type];
            }

            var def = new ClassDefinition(this, name)
                .addConstructor(constructorFn);

            _.each(metadata.extend, function(parent) {
                def.inherit(parent);
            });
            _.forIn(methods, function(value, key) {
                def.addProperty(key, value);
            });

            _.each(metadata.type, function(type) {
                def.addType(type);
            });

            return def;
        },
        type : function(type, def) {
            // setter
            if(type && def) {
                _types[type] = _types[type] || [];
                _types[type].push(def);
                return;
            }

            // getters
            var result = [];
            if(!type) {
                // get registered types
                _.forIn(_types, function(value, _type) {
                    result.push(_type);
                });
            }
            else {
                // return names declaring to implement given protocol
                _.each(_types[type], function(_type) {
                    result.push(_type);
                });
            }
            return result;
        }
    };
}));