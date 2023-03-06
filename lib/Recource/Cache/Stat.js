
const fs = require('fs');

module.exports = {

    read(file) { 
        let { size, ctimeMs, mtimeMs, birthtimeMs, } = fs.statSync(file);

        ctimeMs = Number.parseInt(ctimeMs.toString().split('.')[0]);
        mtimeMs = Number.parseInt(mtimeMs.toString().split('.')[0]);
        birthtimeMs = Number.parseInt(birthtimeMs.toString().split('.')[0]);

        return { size, ctimeMs, mtimeMs, birthtimeMs, };
    },
};