
const colors = require('colors');
const Progress = require('progress');
const $String = require('@definejs/string');


const mapper = new Map();

class ProgressBar {

    /**
    * 已重载 ProgressBar();
    * 已重载 ProgressBar(total);
    * 已重载 ProgressBar(list);
    * 已重载 ProgressBar(config);
    * @param {*} config 
    * @param {Console} console 要使用的 console 实例。
    *   如果不指定，则使用全局默认的 console 对象。
    *   如果要使用把日志写入文件的功能，请使用特殊的 Console 实例，如 `@webpart/console` 中的。
    */
    constructor(config, console) {
        //重载 ProgressBar(total); 的情况。
        if (typeof config == 'number') {
            config = { 'total': config, };
        }
        else if (Array.isArray(config)) {
            config = { 'total': config.length, };
        }

        config = Object.assign({}, exports.defaults, config);
        console = console || global.console;


        let { total, } = config;

        let bar = new Progress(':title:bar', {
            'total': total,
            'width': config.width,
            'complete': config.complete,
            'incomplete': config.incomplete,
        });

        let meta = {
            'bar': bar,
            'value': 0,
            'total': total,
            'console': console,
        };

        mapper.set(this, meta);
    }

    /**
    * 
    * @param {object} opt 
    * 
    */
    render(opt = {}) {
        if (typeof opt == 'string') {
            opt = { 'msg': opt, };
        }

        let { value, msg, text, } = opt;
        let meta = mapper.get(this);
        let { bar, total, } = meta;

        if (value) {
            meta.value = value;
        }
        else {
            value = ++meta.value;
        }

        let totalText = total.toString();
        let valueText = $String.padLeft(value, totalText.length, '0');
        let percent = (value / total * 100).toFixed(2);
        let title = `${valueText}/${totalText}=${percent}%`;

        if (msg) {
            this.interrupt(msg);
        }

        let { titleColor, } = exports.defaults;


        text = text || '';

        bar.tick({
            'title': colors[titleColor.backgroud][titleColor.text](`${text}${title}`),
            // 'title': `${text}${title}`.bgGreen,
            // 'title': colors.bgBlue.cyan(`${text}${title}`),

        });

        colors.bgBlue.cyan(`${text}${title}`)

    }

    interrupt(msg) {
        let meta = mapper.get(this);
        let { console, bar, } = meta;

        //同时写入到文件中。
        if (console.write) {
            console.write('log', msg);
        }

        bar.interrupt(msg);
    }

    log(...args) {
        let meta = mapper.get(this);
        let msg = args.join(' ');

        this.interrupt(msg);
    }
}


ProgressBar.defaults = {
    width: 50,
    complete: ' '.bgGreen,
    incomplete: ' '.bgBlack,

    titleColor: {
        backgroud: 'bgBlue',
        text: 'cyan',
    },
};


module.exports = exports = ProgressBar;


