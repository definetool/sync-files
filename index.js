
require('colors');

const $Date = require('@definejs/date');
const ProgressBar = require('./lib/ProgressBar');
const Task = require('./modules/Task');

function create(config) { 
    let { defaults, } = exports;

    let dt = $Date.format(defaults.datetime);
    let home = config.home || `./output/${dt}/`

    let task = new Task({
        'home': home,
        'source': config.source,
        'target': config.target,

        'console': config.console || defaults.console,
        'cache': config.cache || defaults.cache,
    });

    return task;
}

module.exports = exports = {
    ProgressBar,
    Task,

    defaults: {
        datetime: 'yyyy-MM-dd@HH.mm.ss',
        console: 'console.log',
        cache: '.sync-files/',
    },

    parse(config) { 
        if (typeof config == 'string') {
            config = { 'target': config, };
        }

        let task = create(config);

        task.parse();
    },

    sync(config) { 
        let task = create(config);

        task.parse();
        task.sync();
        task.clear();
        task.verify();
    },


};


