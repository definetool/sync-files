
const Task = require('../modules/Task');

const config = {
    source: '/Users/micty/Pictures/Canon/test/1/source',
    target: '/Users/micty/Pictures/Canon/test/1/target',


    cache: '.sync-files/',

    patterns: [
        // '**/*.*',     //匹配 `文件名.后缀名`，但不匹配 `.后缀名` 和 `文件名`。
        '**/*',          //匹配 `文件名.后缀名`、`文件名`、`文件名.`，但不匹配 `.后缀名`。 即匹配所有含有文件名的文件。
        '**/.*',         //匹配 `.后缀名`，即匹配只含有后缀名的文件。
        '!**/.DS_Store',
        '!**/Thumbs.db',
    ],

    output: {
        dir: `../output/`,
        deletes: 'deletes/',
        // deletes: false,
        console: `console.log`,
        parse: `parse.{type}.json`,
        // parse: false,
        compare: `compare.{type}.json`,
        // compare: false,
        syn: `syn.{type}.json`,
    },

};



let task = new Task(config);
console.log(task);
let { source, target, } = task.parse();
let compare = task.compare({ source, target, });

target = task.sync({ source, target, compare, });