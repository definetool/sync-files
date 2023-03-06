

module.exports = {
    //尝试找出 dest 中最适合对应 srcs 中的哪一个。
    find({ srcs, hash, source, target, }) {
        let main = source.hash$main[hash];

        //先看看主文件在 target 中是否已存在（被占用）。
        //如果不占用，则还要看是否已被使用过了。
        if (!target.file$hash[main] && srcs.has(main)) {
            return main;
        }

        srcs = [...srcs];

        //主文件在 target 中已被占用，则尝试找出其它还没有被占用的 src。
        let src = srcs.find((src) => {
            return !target.file$hash[src];
        });

        //如果全都被占用。
        return src || srcs[0];
    },


   
};