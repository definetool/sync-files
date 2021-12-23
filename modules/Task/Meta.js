const Path = require('@definejs/path');

module.exports = {
    create(config, more) { 
        let { home, source, target, } = config;
        let { console, } = more;

        if (source) {
            source = Path.resolve(source);
            source = Path.normalizeDir(source);
        }

        if (target) {
            target = Path.resolve(target);
            target = Path.normalizeDir(target);
        }

       
        let meta = {
            'home': home,
            'console': console,
            'timer': more.timer,
            'source': source ? { 'dir': source, 'cache': null, } : null,
            'target': target ? { 'dir': target, 'cache': null, } : null,
       
            'sync': null,   //保存 sync() 的结果。
            'clear': null,  //保存 clear() 的结果。

            'stat': {
                successCopys: [],
                failCopys: [],
                successRenames: [],
                failRenames: [],
                jumpFiles: [],
                deleteDirs: [],
                deleteFiles: [],
            },
         
        };

        return meta;
    },
};