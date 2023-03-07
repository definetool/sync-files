
const Dirs = require('./Sync/Dirs');
const Files = require('./Sync/Files');


module.exports = {

    //删除文件。
    'deleteFiles': Files.delete,

    //同步目录结构。
    'createDirs': Dirs.create,

    //移动冲突文件。
    'randomFiles': Files.random,

    //移动文件。
    'renameFiles': Files.rename,

    //复制文件。
    'copyFiles': Files.copy,

    //删除目录。
    'deleteDirs': Dirs.delete,
    

};