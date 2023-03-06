

module.exports = {

    /**
    * 获取文件大小的描述。
    */
    getDesc(size) {
        if (!size) {
            return { value: '0', desc: '', };
        }

        if (size <= 1024) {
            // return { value: size, desc: 'B', };
            return { value: '1', desc: 'KB', };
        }

        size = size / 1024; //KB

        if (size < 1024) {
            size = Math.ceil(size);
            return { value: `${size}`, desc: 'KB', };
        }


        size = size / 1024; //MB

        if (size < 1024) {
            size = size.toFixed(2);

            if (size.endsWith('0')) { //如 19.x0
                size = size.slice(0, -1);
            }

            if (size.endsWith('0')) { //如 19.0
                size = size.slice(0, -2);
            }

            return { value: `${size}`, desc: 'MB', };
        }



        size = size / 1024; //GB

        size = size.toFixed(2);

        if (size.endsWith('0')) { //如 19.x0
            size = size.slice(0, -1);
        }

        if (size.endsWith('0')) { //如 19.0
            size = size.slice(0, -2);
        }


        return { value: size, desc: 'GB', };

    },

};





