
require('colors');

const $Date = require('@definejs/date');
const File = require('@definejs/file');

const Resource = require('./lib/Recource');
const Console = require('./lib/Console');
const Task = require('./modules/Task');



module.exports = exports = {
    Task,

    parse(config) {
        if (typeof config == 'string') {
            config = { 'dir': config, };
        }

        config = Object.assign({}, Task.defaults.source, config);

        let { dir, cache, patterns, } = config;
        let output = `./output/${$Date.format('yyyy-MM-dd@HH.mm.ss') }/`;

        let console = Console.create(`${output}console.log`);
        let resource = Resource.parse(console, { dir, cache, patterns, });

        File.writeJSON(`${output}parse.resource.json`, resource);

        return resource;
    },

    sync(config) {
        let { output, } = config;

        if (!output) {
            output = `./output/${$Date.format('yyyy-MM-dd@HH.mm.ss')}/`;
        }

        config = { ...config, output, };

        let task = new Task(config);
        let { source, target, } = task.parse();
        let compare = task.compare({ source, target, });
        let sync = task.sync({ source, target, compare, });

        return { source, target, compare, sync, };
    },


};


