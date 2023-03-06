
const Console = require('../../../lib/Console');


module.exports = {
    create(output) { 
        let { dir, console, } = output;

        if (!dir || !console) {
            return global.console;
        }

        console = `${dir}${console}`;
        console = Console.create(console);

        return console;

    },
};