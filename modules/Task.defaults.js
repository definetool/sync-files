
module.exports = {
    console: 'console.log',
    cache: '.sync-files/',
    simulate: false,    //是否模仿。 如果是，则不会发生真正的写入、删除等操作。
    patterns: [],       //未指定或为空数组，则匹配全部文件。
};