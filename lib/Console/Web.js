

const path = require('path');
const File = require('@definejs/file');

let replacer = '{-----------------console.log.data-----------------}';
let file = path.join(__dirname, './sample.html');
let sample = '';


module.exports = {

    render(list) { 
        if (!sample) {
            sample = File.read(file);
        }

        let data = list.join('\n');
        let html = sample.replace(replacer, data);
        return html;
    },

};