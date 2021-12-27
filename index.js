
require('colors');

const $Date = require('@definejs/date');
const ProgressBar = require('./lib/ProgressBar');
const Task = require('./modules/Task');

function create(config) { 

    let dt = $Date.format('yyyy-MM-dd@HH.mm.ss');
    let home = config.home || `./output/${dt}/`

    let task = new Task({
        'home': home,
        ...config,
    });

    return task;
}

module.exports = exports = {
    ProgressBar,
    Task,

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


