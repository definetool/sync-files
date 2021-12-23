const File = require('@definejs/file');
const Path = require('@definejs/path');

module.exports = {
    /**
    * 
    * @param {*} name 
    * @param {*} data 
    * @returns 
    */
    write(meta, name, data) {
        if (!meta.home) {
            return;
        }

        let file = Path.join(meta.home, name);
        let content = typeof data == 'string' ? data : JSON.stringify(data, null, 4);

        File.write(file, content);

    },

    /**
    * 
    * @param {*} meta 
    * @param {*} name 
    * @returns 
    */
    read(meta, name) {
        if (!meta.home) {
            return;
        }

        let file = Path.join(meta.home, name);
        let content = File.read(file);

        if (name.toLowerCase().endsWith('.json')) {
            content = JSON.parse(content);
        }

        return content;
    },

};