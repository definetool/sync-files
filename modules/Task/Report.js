const colors = require('colors');
const $String = require('@definejs/string');


function format(num, len) {
    if (Array.isArray(num)) {
        num = num.length;
    }

    num = num.toString();
    num = $String.padLeft(num, len, ' ');

    return num.cyan;
}

function maxLen(...args) {
    
    args = args.map((item) => {
        return Array.isArray(item) ? item.length : item;
    });

    let max = Math.max(...args);
    max = max.toString();

    return max.length;
}



module.exports = {

    render({ console, timer, source, target, }) {
        let s = source;
        let t = target;

        let repeat0 = s.files.length - Object.keys(s.md5$main).length;
        let repeat1 = t.files.length - Object.keys(t.md5$main).length;

        let max0 = maxLen(s.files, t.files);
        let max1 = maxLen(s.dirs, t.dirs);
        let max2 = maxLen(repeat0, repeat1);


        timer.stop(`总耗时: {text}`);

        console.log(`  source 目录: 文件数=${format(s.files, max0)} | 目录数=${format(s.dirs, max1)} | 重复文件数=${format(repeat0, max2)} | 校验和=${s.sum.cyan}`);
        console.log(`  target 目录: 文件数=${format(t.files, max0)} | 目录数=${format(t.dirs, max1)} | 重复文件数=${format(repeat1, max2)} | 校验和=${t.sum.cyan}`);

    },

    stat(meta) {
        let { console, stat,} = meta;

        let {
            successCopys,
            failCopys,
            successRenames,
            failRenames,
            jumpFiles,
            deleteDirs,
            deleteFiles,
        } = stat;

        console.log(`            ├──复制文件数=${colors.cyan(successCopys.length)}`);
        console.log(`            ├──重命名文件数=${colors.cyan(successRenames.length)}`);
        console.log(`            ├──跳过文件数=${colors.cyan(jumpFiles.length)}`);
        console.log(`            ├──删除目录数=${colors.cyan(deleteDirs.length)}`);
        console.log(`            └──删除文件数=${colors.cyan(deleteFiles.length)}`);


        if (failCopys.length + failRenames.length == 0) {
            return false;
        }


        if (failCopys.length > 0) {
            console.log(`无法复制的文件，共 ${failCopys.length} 个:`.bgRed);

            failCopys.forEach((file) => {
                console.log(`  ${file.red}`);
            });
        }

        if (failRenames.length > 0) {
            console.log(`无法重命名的文件， 共 ${failRenames.length} 个:`.bgRed);
            failRenames.forEach((file) => {
                console.log(`  ${file.red}`);
            });
        }


        return true;

        


    },
};