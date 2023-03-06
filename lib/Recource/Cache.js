
const Path = require('@definejs/path');
const File = require('@definejs/file');

const List = require('./Cache/List');
const Stat = require('./Cache/Stat');


let mapper = new Map();

class Cache {

    constructor(home, children = []) { 
        let dir = Path.resolve(`${home}/../`);
        dir = Path.normalizeDir(dir);

        home = Path.resolve(home);
        home = Path.normalizeDir(home);

        children = children.map((home) => {
            let child = new Cache(`${dir}${home}`);
            return child;
        });
   

        let file = `${home}file$info.json`;
        let txt = `${file}.txt`;

        let meta = {
            home,
            dir,
            file,
            txt,
            children,
            file$info: {},
        };

        mapper.set(this, meta);

        
        this.meta = meta;

    }


    parse() { 
        let meta = mapper.get(this);
        let file$info = File.readJSON(meta.file) || {};
        let file$info1 = List.parse(meta.txt);  //上次程序中断后留下的临时记录。
       
        meta.children.forEach((child) => {
            let file$info2 = child.parse();

            Object.assign(file$info, file$info2);
        });

        Object.assign(file$info, file$info1);
        meta.file$info = file$info;


        return file$info;
    }


    /**
    * 
    * @param {*} file 
    * @param {*} info 
    */
    add(file, info) {
        let meta = mapper.get(this);
        let item = { [file]: info, };

        meta.file$info[file] = info;
        List.add(meta.txt, item);
    }
    
    /**
    * 获取指定文件的信息。
    * @param {string} file 相对路径的文件名。
    * @returns 
    */
    get(file) { 
        let meta = mapper.get(this);
        let info = meta.file$info[file];
        let stat = Stat.read(`${meta.dir}${file}`); //没有 hash 字段。

        let expired = !info ||
            info.size != stat.size ||
            info.ctimeMs != stat.ctimeMs ||
            info.mtimeMs != stat.mtimeMs ||
            info.birthtimeMs != stat.birthtimeMs;
        
        if (expired) {
            info = stat;
        }
        
        return info;
    }

    update(files) { 
        let meta = mapper.get(this);
        let file$info = {};
        let list = [];

        //原 cache 中可能包含一些多余的记录。
        //此处要过滤出需要保留的。
        files.forEach((file) => {
            let info = meta.file$info[file];
            
            if (!info) {
                return;
            }

            file$info[file] = info;

            //自定义输出的 json 格式。
            file = JSON.stringify(file);
            info = JSON.stringify(info);

            list.push(`    ${file}: ${info}`);
        });
        

        meta.file$info = file$info;
        list = `{\n${list.join(', \n')}\n}`;

        File.write(meta.file, list);
        File.delete(meta.txt);

    }

    



}

module.exports = Cache;