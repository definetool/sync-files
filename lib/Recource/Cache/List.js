
const File = require('@definejs/file');


let file$list = {};


module.exports = {

    parse(fullfile) { 
        if (!File.exists(fullfile)) {
            return {};
        }

        let file$info = {};
        let list = File.read(fullfile);

        list = list.split('\n');

        list.forEach((item) => {
            if (!item) {
                return;
            }

            item = JSON.parse(item);
            Object.assign(file$info, item);
        });

        return file$info;
    },

    add(file, item) {
        let list = file$list[file];

        if (!list) {
            list = file$list[file] = [];
        }

        item = JSON.stringify(item);
        list.push(item);
       
        //为了减少写入临时文件的频次，收集满一定条数后再一次写入。
        if (list.length > 100) {
            File.append(file, list.join('\n') + '\n');
            list = file$list[file] = [];
        }

    },
};