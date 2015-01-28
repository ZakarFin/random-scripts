define([
    'intern!tdd',
    'intern/chai!assert',
    'lodash',
    '../src/storage'
], function(tdd, assert, _, Storage) {
    tdd.suite('Storage', function() {

        tdd.test('simple store', function() {
            var store = new Storage();
            assert.equal(typeof store.data, 'function', "store should have a data-function");
            assert.ok(_.isArray(store.data()), 'Calling data without key should return an array');
            assert.equal(store.data().length, 0, 'Empty store should have 0 keys');
            assert.notOk(store.data("my key"), 'Empty store shouldnt have value for key "my key"')

            // inserting data
            store.data("my key", "my value");
            assert.equal(store.data().length, 1, 'Store should have 1 key');
            assert.equal(store.data()[0], "my key", 'Store should return the used key');
        });

        tdd.test('simple store', function() {
            var store = new Storage({
                validator : function(value) {
                    // only allow functions to be stored as handlers
                    return typeof value === 'function';
                },
                defaultValue : []
            });
        });
    });
});
