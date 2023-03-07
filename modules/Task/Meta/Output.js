
const Path = require('@definejs/path');

module.exports = {

    normalize(config, defaults) { 
        if (typeof config == 'string') {
            config = { 'dir': config, };
        }

        config = Object.assign({}, defaults, config);


        let { dir, deletes, console, parse, compare, sync, } = config;

        //为了方便调用者的处理，这里返回一个空对象而不是 null。
        if (!dir) {
            return {};
        }


        dir = Path.resolve(dir);
        dir = Path.normalizeDir(dir);

        if (deletes) {
            deletes = Path.normalizeDir(deletes);
        }

        if (console) {
            console = Path.normalize(console);
        }

        if (parse) {
            parse = Path.normalize(parse);
        }

        if (compare) {
            compare = Path.normalize(compare);
        }

        if (sync) {
            sync = Path.normalize(sync);
        }


        return { dir, deletes, console, parse, compare, sync, };



    },
};