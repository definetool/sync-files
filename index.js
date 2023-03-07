
require('colors');

const $Date = require('@definejs/date');
const File = require('@definejs/file');

const Resource = require('./lib/Recource');
const Console = require('./lib/Console');
const Task = require('./modules/Task');


function getOutput({ output }) {
    if (!output) {
        output = `./output/${$Date.format('yyyy-MM-dd@HH.mm.ss')}/`;
    }

    return output;
}


module.exports = exports = {
    
    Task,

    parse(config) {
        if (typeof config == 'string') {
            config = { 'dir': config, };
        }


        config = Object.assign({}, Task.defaults.source, config);

        let output = getOutput(config);
        let { dir, cache, patterns, } = config;
        let console = Console.create(`${output}console.log`);
        let resource = Resource.parse(console, { dir, cache, patterns, });

        File.writeJSON(`${output}parse.resource.json`, resource);

        return resource;
    },

    sync(config) {
        let output = getOutput(config);
        let task = new Task({ ...config, output, });
        let { source, target, } = task.parse();
        let compare = task.compare({ source, target, });
        let sync = task.sync({ source, target, compare, });

        return { source, target, compare, sync, };
    },


};


