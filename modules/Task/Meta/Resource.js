
const Path = require('@definejs/path');

module.exports = {

    normalize(config, defaults, common) { 
        if (typeof config == 'string') {
            config = { 'dir': config, };
        }

   
        config = Object.assign({}, defaults, common, config);

        if (!config.dir) {
            return null;
        }

        config.dir = Path.resolve(config.dir);
        config.dir = Path.normalizeDir(config.dir);
        config.cache = Path.normalizeDir(config.cache);

        return config;



    },
};