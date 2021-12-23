
const Path = require('@definejs/path');
const File = require('@definejs/file');


let mapper = new Map();

class Cache {
    /**
    * 
    * @param {*} dir 
    * @param {*} name 
    */
    constructor(dir, name) {
        let home = name ? Path.join(dir, name, '/') : '';  //如 `/Users/micty/Pictures/iPhone 8P/.sync-files/`;
        let json = `${home}name$md5.json`;
        let txt = `${json}.txt`;

        let meta = {
            'dir': dir,
            'home': home, //如果为 空，则说明不启用 cache。
            'json': json,
            'txt': txt,
        };
       
        mapper.set(this, meta);
    }

    /**
    * 
    * @param {*} dir 
    * @returns 
    */
    is(dir) {
        let meta = mapper.get(this);
        if (!meta.home) {
            return false;
        }

        dir = Path.normalizeDir(dir);

        return dir == meta.home;
    }

    /**
    * 
    * @param {*} file 
    * @param {*} md5 
    */
    add(file, md5) {
        let meta = mapper.get(this);
        if (!meta.home) {
            return;
        }

        let name = Path.relative(meta.dir, file);
        let item = { [name]: md5, };

        item = JSON.stringify(item);
        item = item + '\n';
        
        File.append(meta.txt, item);

    }

    /**
    * 
    * @returns 
    */
    read() { 
        let meta = mapper.get(this);
        if (!meta.home) {
            return {};
        }

        let name$md5 = {};
        let file$md5 = {};

        if (File.exists(meta.json)) {
            name$md5 = File.readJSON(meta.json);
        }


        if (File.exists(meta.txt)) {
            let list = File.read(meta.txt);
            list = list.split('\n');

            list.forEach((item) => {
                if (item) {
                    item = JSON.parse(item);
                    Object.assign(name$md5, item);
                }
            });
        }

        Object.keys(name$md5).forEach((name) => {
            let md5 = name$md5[name];
            let file = Path.join(meta.dir, name);

            file$md5[file] = md5;
        });

        return file$md5;

    }

    /**
    * 
    * @param {*} file$md5 
    */
    write(file$md5) { 
        let meta = mapper.get(this);
        if (!meta.home) {
            return;
        }

        let name$md5 = {};

        Object.keys(file$md5).forEach((file) => {
            let md5 = file$md5[file];
            let name = Path.relative(meta.dir, file);

            name$md5[name] = md5;
        });

        File.writeJSON(meta.json, name$md5);
        File.delete(meta.txt);
    }

   



}


module.exports = Cache;