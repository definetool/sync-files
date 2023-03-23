const { Console, } = require('@webpart/console');
const File = require('@definejs/file');

const Colors = require('./Console/Colors');
const Web = require('./Console/Web');

module.exports = {

    create(file) {
        let list = [];
        let txt = `${file}.txt`;    //`output/console.log.txt`;
        let web = `${file}.html`;   //`output/console.log.html`;

        File.delete(file);
        File.delete(txt);
        File.delete(web);

        console = new Console({ file, });

        console.on({
            'add': function (item) {

                //写入 html 文件。
                list.push(JSON.stringify(item));

                let html = Web.render(list);
                File.write(web, html);

                
                //写入 txt 文件。
                let { msg, } = item;
                msg = Colors.trim(msg);
                msg = `${msg}\n`;

                File.append(txt, msg);
               
                
            },
        });

        return console;
    },
};