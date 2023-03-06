

const { parse, sync, } = require('./index');

// parse('/Users/micty/Pictures/Canon/test/1');


sync({
    source: '/Users/micty/Pictures/Canon/test/1/source',
    target: '/Users/micty/Pictures/Canon/test/1/target',
});