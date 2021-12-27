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
    // simulate: true,
    // home: `./output/`,

    source: '/Users/micty/Pictures/iPhone 8P/JPG',
    // source: '/Users/micty/Pictures/iPhone 8P/Exports/20211223.src',
    target: '/Users/micty/Pictures/test',

    patterns: [
        // '**/*.*',     //匹配 `文件名.后缀名`，但不匹配 `.后缀名` 和 `文件名`。
        '**/*',          //匹配 `文件名.后缀名`、`文件名`、`文件名.`，但不匹配 `.后缀名`。 即匹配所有含有文件名的文件。
        '**/.*',         //匹配 `.后缀名`，即匹配只含有后缀名的文件。
        '!**/.DS_Store',
        '!**/Thumbs.db',
    ],

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