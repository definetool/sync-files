

const $Timer = require('@definejs/timer');
const $Date = require('@definejs/date');
const $String = require('@definejs/string');

let mapper = new Map();

class Timer {

    constructor(console) {
        let timer = new $Timer();

        let meta = {
            'timer': timer,
            'console': console,
        };


        mapper.set(this, meta);
    }

    start(msg) {
        let meta = mapper.get(this);
        let { timer, console, } = meta;

        timer.start();

        if (msg) {
            console.log(msg);
        }
    }

    stop(msg) {
        let meta = mapper.get(this);
        let { timer, console, } = meta;

        let { dt, } = timer.stop();
        let { desc, } = $Date.size(dt);
        let { ww, dd, hh, mm, ss, ms, } = desc;

        let text = `${ww}${dd}${hh}${mm}${ss}${ms}` || `0`;


        if (msg) {
            msg = $String.format(msg, {
                'text': text.cyan,
            });

            console.log(msg);
            console.log(``);
        }

        return text;

    }
}

module.exports = Timer;

