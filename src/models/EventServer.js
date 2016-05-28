import _ from 'lodash';

var listeners = {};
var EventListener = {
    flush() {
        listeners = {};
    },
    /**
     * Will call fn when 'name' event is emitted.
     * @param  {String}   name The name of the event to listen on.
     * @param  {Function} fn   The function to be invoked.
     * @param {String} id An identifier for debugging purposes.
     */
    on(name, fn, id) {
        if (!listeners.hasOwnProperty(name)) {
            listeners[name] = [];
        }
        listeners[name].push({
            id: id,
            fn: fn
        });
    },
    /**
     * Emit the event
     * @param  {String}    name   The name of the event.
     * @param  {Array} values The values that should be sent with the emit.
     */
    emit(name, ...values) {
        if (listeners.hasOwnProperty(name)) {
            listeners[name].forEach(function(listener) {
                setTimeout(function() {
                    // console.log(`invoking ${listener.id} for event ${name}`);
                    listener.fn(...values);
                    // console.log(`done ${li/stener.id} for event ${name}`);
                });
            });
        }
    },
    remove(name, id) {
        if (listeners.hasOwnProperty(name)) {
            _.remove(listeners[name], {id: id});
        }
    },
    /**
     * Partial call emit, this is usefull when you want to emit this when a dom event occurs.
     * For example: onClick(EventListener.partialEmit('click', 'some', 'values')).
     * @param  {String}    name   The name of the event.
     * @param  {Array} values     The values that should be sent with the emit.
     * @return {Function}         A partial function of EventListener.emit
     */
    partialEmit(name, ...values) {
        return _.partial(EventListener.emit, name, ...values);
    }
};

export
default EventListener;
