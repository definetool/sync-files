
const $String = require('@definejs/string');
const path = require('path');


module.exports = {
    get(file) {
        let ext = path.extname(file);
        let random = $String.random();

        //如 `a/b/test.js-QKLEKERLRELWK.js`
        return `${file}.${random}${ext}`;

    },
};