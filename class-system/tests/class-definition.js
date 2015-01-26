define([
    'intern!tdd',
    'intern/chai!assert',
    'lodash',
    '../src/class-definition',
    '../src/registry'
], function(tdd, assert, _, ClassDefinition, Registry) {
    tdd.suite('ClassDefinition', function() {

        tdd.test('simple functions and inheritance', function() {

            var baseDef = new ClassDefinition(Registry, "Base");
            baseDef.addConstructor(function() {
                this._list = ['value1'];
            });
            assert.ok(Registry.definition("Base"), "Base definition should be in registry");


            var def = new ClassDefinition(Registry, "Simple");

            assert.equal(def.getName(), "Simple", 'Name should be the one given');
            def.addConstructor(function() {
                this._list.push('value 2');
            });
            def.inherit("Base");
            def.addProperty('testAttr', 'joo');
            def.addProperty('get', function() {
                return this._list.join();
            });

            // create a class based on definition
            var impl = def.create();

            assert.equal(impl.testAttr, 'joo', 'Impl should have def property');
            assert.equal(impl.get(), 'value1,value 2', 'Impl should have list in correct order');
        });
    });

    tdd.suite('ClassSystem with ClassDefinition', function() {

        tdd.test('define anonymous object', function() {

            var def = new ClassDefinition(Registry);
            def.addProperty('testAttr', 'anon value');
            var defImpl = def.create();
            assert((typeof defImpl === 'object'), 'constructor function returns an implementation object');
            assert.equal(defImpl.testAttr, 'anon value', 'implementation objects testAttr has correct value');
        });

        tdd.test('define anonymous object with constructor', function() {

            var def = new ClassDefinition(Registry);
            def.addConstructor(function() {
                    this._val = 'anon constr'
                })
                .addProperty(
                    'testAttr',
                    function() {
                        return this._val
                    }
                );

            var defImpl = def.create();
            assert((typeof defImpl === 'object'), 'constructor function returns an implementation object');
            assert.equal(defImpl.testAttr(), 'anon constr', 'implementation objects testAttr() has correct value');
        });

        tdd.test('define simple object only class', function() {

            var def = new ClassDefinition(Registry, "SimpleObjClass")
                .addProperty(
                    'testAttr', 'test value'
                );

            var defImpl = def.create();
            assert((typeof defImpl === 'object'), 'constructor function returns an implementation object');
            assert.equal(defImpl.testAttr, 'test value', 'implementation objects testAttr has correct value');

            var impl = Registry.create('SimpleObjClass');
            assert((typeof impl === 'object'), 'Calling Registry.create returns an implementation object');
            assert(impl.testAttr, 'test value', 'Registry.created implementation objects testAttr has correct value');
        });

        tdd.test('define simple constructor class', function() {

            var def = new ClassDefinition(Registry, "SimpleConstrClass")
                .addConstructor(function() {
                    this._value = 'constructor setter'
                })
                .addProperty(
                    'testAttr',
                    function() {
                        return this._value;
                    }
                );
            var defImpl = def.create();
            assert((typeof defImpl === 'object'), 'constructor function returns an implementation object');
            assert.equal(defImpl.testAttr(), 'constructor setter', 'implementation objects testAttr has correct value');

            var impl = Registry.create('SimpleConstrClass');
            assert((typeof impl === 'object'), 'Calling Registry.create returns an implementation object');
            assert(impl.testAttr(), 'constructor setter', 'Registry.created implementation objects testAttr has correct value');
        });

        tdd.test('define simple inherited class', function() {
            var def = Registry.define(
                'SimpleInheritedClass', {
                    testAttr2: 'test value 2'
                }, {
                    extend: 'SimpleObjClass'
                });

            var impl = Registry.create('SimpleInheritedClass');
            assert(impl.testAttr, 'test value', 'implementation objects testAttr has correct inherited value');
            assert(impl.testAttr2, 'test value 2', 'implementation objects testAttr2 has correct value');
        });

        tdd.test('define simple inherited class with array extend', function() {
            Registry.define(
                'SimpleInheritedClassWithArray', {
                    testAttr3: 'test value 3'
                }, {
                    extend: ['SimpleObjClass']
                });

            var impl = Registry.create('SimpleInheritedClassWithArray');
            assert(impl.testAttr, 'test value', 'implementation objects testAttr has correct inherited value');
            assert(impl.testAttr3, 'test value 3', 'implementation objects testAttr3 has correct value');
        });

        tdd.test('define class with multiple parents', function() {
            Registry.define(
                'MultiInheritedClass', {
                    testAttr4: 'test value 4'
                }, {
                    extend: ['SimpleObjClass', 'SimpleInheritedClass', 'SimpleInheritedClassWithArray']
                });

            var impl = Registry.create('MultiInheritedClass');
            assert(impl.testAttr, 'test value', 'inherited testAttr has correct value');
            assert(impl.testAttr2, 'test value 2', 'inherited testAttr2 has correct value');
            assert(impl.testAttr3, 'test value 3', 'inherited testAttr3 has correct value');
            assert(impl.testAttr4, 'test value 4', 'implementation objects testAttr has correct declared value');
        });

        tdd.test('define class with multiple parents constructor order', function() {
            // define base with name and constructor
            Registry.define('InheritBase',
                function() {
                    this._ordering = ['first'];
                });

            // lets try with chaining on the second
            Registry
                .define('InheritSecond')
                .inherit('InheritBase')
                .addConstructor(function() {
                    this._ordering.push('second');
                });

            // lets try anonymous with chaining on the third
            var def = Registry
                .define(function() {
                    this._ordering.push('third');
                })
                .addProperty('getOrdering', function() {
                    return this._ordering.join();
                })
                .inherit('InheritSecond');

            var impl3 = def.create();
            assert(impl3.getOrdering(), 'first,second,third', 'multistep inherited constructors are called in correct order');
        });

        tdd.test('define simple protocol class', function() {
            Registry.define('EventClass').addType('Event');
            var protocols = Registry.type();
            var events = Registry.type('Event');
            var impl = Registry.create('EventClass');
            assert(protocols.length, 1, 'Should have one registered protocol');
            assert(protocols[0], 'Event', 'Registered protocol should be "Event"');
            assert(events.length, 1, 'Should have one class implementing protocol "Event"');
            assert(events[0], 'EventClass', 'Registered class for protocol "Event" should be "EventClass"');
        });
    });
});