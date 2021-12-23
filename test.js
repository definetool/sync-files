const $Date = require('@definejs/date');
const { sync, ProgressBar, } = require('./index');

let dt = $Date.format(`yyyy-MM-dd@HH.mm.ss`);


Object.assign(ProgressBar.defaults, {
    width: 100,
    complete: ' '.bgCyan,

    titleColor: {
        backgroud: 'bgCyan',
        text: 'black', 
    },
});

sync({
    home: `./output/${dt}/`,

    source: '/Users/micty/Pictures/iPhone 8P/JPG',
    target: '/Users/micty/Pictures/test',

    // source: '/Volumes/3/Canon',
    // target: '/Users/micty/Pictures/Canon',

    // source: '/Volumes/3/摄像头监控',
    // target: '/Users/micty/Movies/摄像头监控',
});




// const { parse, sync, } = require('./index');

// // parse({
// //     source: '/Users/micty/Pictures/iPhone 8P/JPG',
// //     // target: '/Users/micty/Pictures/test',
// // });

// // parse('/Users/micty/Pictures/iPhone 8P/JPG');

// sync({
//     source: '/Users/micty/Pictures/iPhone 8P/JPG',
//     target: '/Users/micty/Pictures/test',
// });