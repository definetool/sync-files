

const { parse, sync, } = require('./index');

// parse('/Users/micty/Pictures/Canon/test/1');


// sync({
//     source: '/Users/micty/Pictures/Canon/test/1/source',
//     target: '/Users/micty/Pictures/Canon/test/1/target',
// });


// sync({
//     source: '/Volumes/3/照片与视频/Canon/2008',
//     target: '/Users/micty/Pictures/Canon/2008',
// });

sync({
    source: '/Users/micty/Pictures/Canon/test/2008-source',
    target: '/Users/micty/Pictures/Canon/test/2008-target',
});