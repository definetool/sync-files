
require('colors');

const File = require('@definejs/file');
const $String = require('@definejs/string');

const Recource = require('../lib/Recource');
const Timer = require('../lib/Timer');

const Meta = require('./Task/Meta');
const Compare = require('./Task/Compare');
const Sync = require('./Task/Sync');
const Report = require('./Task/Report');



let mapper = new Map();

class Task {
    /**
    * 构造器。
    * @param {*} config 配置对象。
    *   config = {
    *       home: '',       //会话过程中产生的日志等临时文件的存放目录。 建议每次都使用一个不同的目录，以方便多次运行后进行查找。
    *       console: '',    //会话过程中产生的日志的文件名称。 如果指定，则写入此文件；否则仅在控制台输出。
    *       cache: '',      //解析 source 目录和 target 目录中的文件 MD5 时要保存的元数据信息的目录名，建议指定为 `.sync-files/`。
    *       source: '',     //要同步的源目录。
    *       target: '',     //要同步的目标目录。
    *       patterns: [],   //要同步的文件列表模式。 如果不指定，或指定为空数组，则表示全部文件。
    *   };
    */
    constructor(config) {
        let meta = Meta.create(config, exports.defaults);


        mapper.set(this, meta);

        this.console = console;
        this.meta = meta;

    }


    /**
    * 输出文件到临时目录。
    * 已重载 output(sample, data, json);
    * 已重载 output(file, json);
    * @param {*} file 
    * @param {*} json 
    */
    output(sample, data, json) {
        let meta = mapper.get(this);
        let { output, } = meta;

        if (!output.dir) {
            return;
        }

    
        let file = '';

        //重载 output(file, json);
        if (arguments.length == 2) {
            file = sample;
            json = data;
        }
        else {
            //如取 output.parse 中的模板。
            sample = output[sample] || '';
            file = $String.format(sample, data);
        }
     

        if (!file) {
            return;
        }

        File.writeJSON(`${output.dir}${file}`, json);

    }

    /**
    * 解析。
    * 提取文件的 MD5 信息，保存到 cache 目录中。
    */
    parse() {
        let meta = mapper.get(this);
        let { console, source, target, } = meta;

        source = Recource.parse(console, source, 'source');
        target = Recource.parse(console, target, 'target');


        this.output('parse', { type: 'source', }, source);
        this.output('parse', { type: 'target', }, target);

        return { source, target, };
    }

    /**
    * 
    * @param {*} source 
    * @param {*} target 
    * @returns 
    */
    compare({ source, target, }) {
        let meta = mapper.get(this);
        let { console, } = meta;
        let timer = new Timer(console);

        timer.start(`开始分析差异 >>`.bold);

        let dirs = Compare.parseDirs({ source, target, });
        let files = Compare.parseFiles({ source, target, });

        this.output('compare', { type: 'dirs', }, dirs);
        this.output('compare', { type: 'files', }, files);

        timer.stop(`<< 结束分析差异，耗时{text}。`.bold);

        return { dirs, files, };
    }

    /**
    * 同步。
    */
    sync({ source, target, compare, }) {
        let meta = mapper.get(this);
        let { console, output, } = meta;

        if (source.dir == target.dir) {
            console.log(`source 目录不能与 target 目录相同。`.bgRed);
            return;
        }

        if (source.sum == target.sum) {
            Report.render(console, { source, target, });
            console.log(`source 目录与 target 目录完全一致，无需同步。`.bgGreen.bold);
            return;
        }



        Sync.deleteFiles(console, { target, compare, output, }); //要先清理文件。
        Sync.createDirs(console, { target, compare, });

        Sync.randomFiles(console, { target, compare, });
        Sync.renameFiles(console, { target, compare, });
        Sync.copyFiles(console, { source, target, compare, });

        //这个在最后。 因为 target 目录中可能有些有用文件。
        Sync.deleteDirs(console, {
            target,
            compare,
            output,
            //重新检查一下是否有其它文件。
            getFiles: function (dir) { 
                let { cache, patterns, } = meta.target;
                let files = Recource.getFiles({ dir, cache, patterns, });
                return files;
            },
        }); 



        //校验同步后的结果。
        target = Recource.parse(console, meta.target);
        this.output('sync', { type: 'target', }, target);


        if (source.sum == target.sum) {
            Report.render(console, { source, target, compare, });
            console.log(`======================== 同步成功 ========================`.bgGreen);
        }
        else {
            Report.render(console, { source, target, });
            console.log(`!!!!!!!!!!!!! 同步后的结果不一致 !!!!!!!!!!!!!!!!!!`.bgRed);
        }

        return target;

    }






}

module.exports = exports = Task;
exports.defaults = require('./Task.defaults');