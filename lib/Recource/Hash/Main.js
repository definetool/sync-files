
const path = require('path');


module.exports = {

     //一个 hash 对应多个文件时，找出一个主文件。 
    //必须要有一个主文件，尽量找到不带 `(n)` 这种模式的文件名。
    //如 `IMG_9727.JPG` 与 `IMG_9727 (1).JPG` 为 hash 相同的文件，
    //同主文件为 `IMG_9727.JPG` 而不是 `IMG_9727 (1).JPG`。
    get(files) { 
      
        //`IMG_8018的副本.HEIC`
        //`IMG_9727 (1).JPG`

        //绝大多数情况。
        if (files.length == 1) {
            return files[0];
        }

        //先过滤出不要带 `( )` 和 `的副本` 这两种模式的。
        let mains = files.filter((file) => {
            let name = path.basename(file);

            if (name.includes('(') && name.includes(')')) {
                return false;
            }

            if (name.includes('的副本')) {
                return false;
            }

            if (name.includes(' - 副本')) {
                return false;
            }

            return true;
        });

        //降级到可以接受 `()` 这种模式的。
        if (mains.length == 0) {
            mains = files.filter((file) => {
                let name = path.basename(file);

                if (name.includes('(') && name.includes(')')) {
                    return true;
                }

                return false;
            });
        }

        //再降级到全部的。
        if (mains.length == 0) {
            mains = files;
        }


        //先按自然排序。
        mains.sort();

        let main = mains[0];

        mains.slice(1).forEach((file) => {
            if (file.length < main.length) {
                main = file;
            }
        });



        return main;




    },
};