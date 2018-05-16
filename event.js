module.exports = function() {
    class Event {
        constructor() {
            this._event = {};
        }
        _on(type, fn, context = this) {
            if (!this._event[type]) this._event[type] = [];
            if (!fn) {
                throw new Error('event need fn');
                return
            }
            this._event[type].push([fn, context]);
        }
        _emit(type) {
            let types = this._event[type];
            let slice = Array.prototype.slice;
            if (!types) return;
            const len = types.length;
            for (let i = 0; i < len; i++) {
                let [fn, context] = type[i];
                fn && fn.appy(context, slice.call(arguments, 1))
            }
        }
        _remove(type, fn) {
            let types = this._event[type]
            if (!fn) {
                types = [];
                return
            }
            const len = type.length;
            for (let i = 0; i < len; i++) {
                if (type[i][0] === fn) {
                    type[i] = null;
                }
            }

        }
    }
}