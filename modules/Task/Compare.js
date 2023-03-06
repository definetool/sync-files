
const colors = require('colors');
const Random = require('./Compare/Random');
const Srcs = require('./Compare/Srcs');


module.exports = {

    parseDirs({ source, target, }) {
        let sourceDirs = new Set(source.dirs);
        let targetDirs = new Set(target.dirs);

        let reuseds = [];    //可以复用的目录，即 target 中可以复用的、不需要处理的目录。
        let creates = [];    //需要创建的目录，即需要在 target 中创建的目录。
        let deletes = [];    //需要删除的目录，即需要在 target 中删除的目录。


        target.dirs.forEach((dir) => {
            if (sourceDirs.has(dir)) {
                reuseds.push(dir);
            }
            else {
                deletes.push(dir);
            }
        });


        source.dirs.forEach((dir) => {
            if (targetDirs.has(dir)) {
                // reuseds.push(dir);
            }
            else {
                creates.push(dir);
            }
        });


        return { reuseds, creates, deletes, };

    },

    parseFiles({ source, target, }) {
        let reuseds = [];   //可以复用的文件，即 target 中可以复用的、不需要处理的文件。
        let renames = [];   //可以移动的文件，即 target 中可以重命名的文件，item = { src, dest, };
        let deletes = [];   //需要删除的文件，即需要从 target 中删除的文件。
        let creates = [];   //需要创建的文件，即需要从 source 复制到 target 的文件。

        let file$random = {};   //常规重命名会导致目标文件冲突的，则要先把原目标文件改成一个随机名。 
        let src$dest = {};      //
        let dest$src = {};      //
        let hash$srcs = {};     //hash 对应的 source 文件列表。 srcs 为一个 Set 实例。

        //为了方便后续处理，这里换成 Set。
        Object.entries(source.hash$files).forEach(([hash, files]) => {
            hash$srcs[hash] = new Set(files);
        });


        target.files.forEach((dest) => {
            //按内容查找。 
            //注意，srcs 的长度可能会发生变化。
            let hash = target.file$hash[dest];
            let srcs = hash$srcs[hash];

            //不存在内容相同的 srcs，说明 dest 是多余的。
            if (!srcs || srcs.size == 0) {
                deletes.push(dest);
                return;
            }

            //以下是存在内容相同的 srcs。


            //假设 dest 能映射到 srcs 中同名的 src。
            let src = dest;  

            //srcs 中不包含同名的 dest。
            //尝试找出 dest 中最适合对应 srcs 中的哪一个。
            if (!srcs.has(dest)) {
                src = Srcs.find({ srcs, hash, source, target, });
            }
           
            //删除它，表示已处理。
            srcs.delete(src);  

            //为了发现逻辑错误。 正常情况下是不会触发的。
            if (src$dest[src]) {
                console.log({ src, dest, src$dest, });
                throw new Error(`src 已被占用。`);
            }

            //为了发现逻辑错误。 正常情况下是不会触发的。
            if (dest$src[dest]) {
                console.log({ src, dest, dest$src, });
                throw new Error(`dest 已被占用。`);
            }

            src$dest[src] = dest;
            dest$src[dest] = src;

            //同名，则复用。
            if (src == dest) {
                reuseds.push(dest);
                return;
            }

            //不同名，则要把 dest 改名成 src。
            //此处 src 与 dest 反过来。
            renames.push({ 'src': dest, 'dest': src, }); 

            //target 中已存在同名的目标文件。
            //则先把同名的目标文件改成随机名，避免以后被覆盖。
            if (target.file$hash[src]) {
                file$random[src] = Random.get(src);
            }
            
        });


        //剔除要删除的部分。
        //因为某个 dest 可能要被改成随机名，但它又是要被删除的，
        //所以最终可以不用改成随机名。
        deletes.forEach((file) => {
            delete file$random[file];
        });

        //该文件还没映射到 dest，则要加入到复制列表。
        creates = source.files.filter((src) => {
            return !src$dest[src];
        });



        return { reuseds, creates, renames, deletes, dest$src, file$random, };
    },



   
};