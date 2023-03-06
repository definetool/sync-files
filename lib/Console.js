const { Console, } = require('@webpart/console');
const File = require('@definejs/file');

const Colors = require('./Console/Colors');

module.exports = {

    create(file) {
        //`output/console.log.txt`;
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