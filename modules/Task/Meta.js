

const Console = require('./Meta/Console');
const Output = require('./Meta/Output');
const Resource = require('./Meta/Resource');

module.exports = {
    create(config, defaults) { 
        let { output, source, target, cache, patterns, } = config;
        let common = {};

        if (cache) {
            common.cache = cache;
        }

        if (patterns) {
            common.patterns = patterns;
        }
     


        output = Output.normalize(output, defaults.output);
        source = Resource.normalize(source, defaults.source, common);
        target = Resource.normalize(target, defaults.target, common);

        let console = Console.create(output);

        let meta = {
            output,
            source,
            target,
            console,
            
            timer: null,
        };

        return meta;
    },
};