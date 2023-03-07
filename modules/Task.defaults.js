
module.exports = {

    output: {
        dir: ``,
        console: `console.log`,
        deletes: 'deletes/',
        parse: `parse.{type}.json`,
        compare: `compare.{type}.json`,
        sync: `sync.{type}.json`,
    },

    source: {
        dir: '',
        cache: '.sync-files/',

        patterns: [
            // '**/*.*',        //匹配 `文件名.后缀名`，但不匹配 `.后缀名` 和 `文件名`。
            '**/*',             //匹配 `文件名.后缀名`、`文件名`、`文件名.`，但不匹配 `.后缀名`。 即匹配所有含有文件名的文件。
            '**/.*',            //匹配 `.后缀名`，即匹配只含有后缀名的文件。
            '!**/.ds_store',
            '!**/.DS_Store',
            '!**/desktop.ini',
            '!**/Desktop.ini',
            '!**/thumbs.db',
            '!**/Thumbs.db', 
        ],
       
    },

    target: {
        dir: '',
        cache: '.sync-files/',

        patterns: [
            // '**/*.*',        //匹配 `文件名.后缀名`，但不匹配 `.后缀名` 和 `文件名`。
            '**/*',             //匹配 `文件名.后缀名`、`文件名`、`文件名.`，但不匹配 `.后缀名`。 即匹配所有含有文件名的文件。
            '**/.*',            //匹配 `.后缀名`，即匹配只含有后缀名的文件。
            '!**/.ds_store',
            '!**/.DS_Store',
            '!**/desktop.ini',
            '!**/Desktop.ini',
            '!**/thumbs.db',
            '!**/Thumbs.db', 
        ],

    },
};