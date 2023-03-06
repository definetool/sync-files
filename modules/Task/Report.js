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

  

    render(console, { source, target, compare, }) {
        if (source && target) {
            let s = source;
            let t = target;

            let repeat0 = s.files.length - Object.keys(s.hash$main).length;
            let repeat1 = t.files.length - Object.keys(t.hash$main).length;

            let max0 = maxLen(s.files, t.files);
            let max1 = maxLen(s.dirs, t.dirs);
            let max2 = maxLen(repeat0, repeat1);

            console.log(`source 目录: 文件数=${format(s.files, max0)} | 目录数=${format(s.dirs, max1)} | 重复文件数=${format(repeat0, max2)} | 校验和=${s.sum.cyan}`);
            console.log(`target 目录: 文件数=${format(t.files, max0)} | 目录数=${format(t.dirs, max1)} | 重复文件数=${format(repeat1, max2)} | 校验和=${t.sum.cyan}`);

        }
       
        if (compare) {
            console.log(`├──跳过目录数=${colors.cyan(compare.dirs.reuseds.length)}`);
            console.log(`├──创建目录数=${colors.cyan(compare.dirs.creates.length)}`);
            console.log(`├──删除目录数=${colors.cyan(compare.dirs.deletes.length)}`);

            console.log(`├──跳过文件数=${colors.cyan(compare.files.reuseds.length)}`);
            console.log(`├──复制文件数=${colors.cyan(compare.files.creates.length)}`);
            console.log(`├──重命名文件数=${colors.cyan(compare.files.renames.length)}`);
            console.log(`└──删除文件数=${colors.cyan(compare.files.deletes.length)}`);
        }
        
       


    },
};