// add any tests to include as dependency
define([
    'tests/class-definition',
    'tests/storage',
    'tests/eventbus'], function(){
    return {
        unit : arguments
    }
});