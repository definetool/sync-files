
require('colors');

const $Date = require('@definejs/date');
const File = require('@definejs/file');

const Resource = require('./lib/Recource');
const Console = require('./lib/Console');
const Timer = require('./lib/Timer');
const Task = require('./modules/Task');


function getOutput({ output }) {
    if (!output) {
        output = `./output/${$Date.format('yyyy-MM-dd@HH.mm.ss')}/`;
    }

    return output;
}


module.exports = exports = {
    Timer,
    Task,

    parse(config) {
        if (typeof config == 'string') {
            config = { 'dir': config, };
        }


        config = Object.assign({}, Task.defaults.source, config);

        let output = getOutput(config);
        let { dir, cache, patterns, } = config;
        let console = Console.create(`${output}console.log`);
        let timer = new Timer(console);

        timer.start(`开始任务 >>`.bold);

        let resource = Resource.parse(console, { dir, cache, patterns, });

        File.writeJSON(`${output}parse.resource.json`, resource);

        timer.stop(`<< 结束任务，耗时: {text}。`.bold);


        return resource;
    },

    sync(config) {

        let output = getOutput(config);
        let task = new Task({ ...config, output, });
        let timer = new Timer(task.console);

        timer.start(`开始任务 >>`.bold);

        let { source, target, } = task.parse();
        let compare = task.compare({ source, target, });
        let sync = task.sync({ source, target, compare, });

        timer.stop(`<< 结束任务，耗时: {text}。`.bold);


        return { source, target, compare, sync, };
    },


};


