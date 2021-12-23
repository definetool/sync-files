const { Console, } = require('@webpart/console');
const Path = require('@definejs/path');
const File = require('@definejs/file');

const Colors = require('./Console/Colors');

module.exports = {

    create({ home, console, }) {
        if (!home || !console) {
            return global.console;
        }
        
        let file = Path.join(home, console);
        let txt = `${file}.txt`;

        File.delete(file);
        File.delete(txt);

        console = new Console({ file, });

        console.on({
            'add': function (item) {
                let { msg, } = item;

                msg = Colors.trim(msg);
                msg = `${msg}\n`;

                File.append(txt, msg);
            },
        });

        return console;
    },
};