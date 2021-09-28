export class SockSync {
    private willloading: boolean = false;
    async load() {
        if (this.willloading == false) return;
        this.willloading = true;
        var r = await import('../../assert/js/primus.js');
        var url = 'http://localhost:8888/';
        var primus = new (r.default)(url, {});
        primus.open();
        primus.on('data', function message(data) {
            console.log('Received a new message from the server', data);
        });
        primus.on('open', function open() {
            console.log('Connection is alive and kicking');
        });
        primus.on('error', function error(err) {
            console.error('Something horrible has happened', err.stack);
        });
        primus.on('reconnect', function (opts) {
            console.log('It took %d ms to reconnect', opts.duration);
        });
        primus.on('reconnect timeout', function (err, opts) {
            console.log('Timeout expired: %s', err.message);
        });
        primus.on('reconnect failed', function (err, opts) {
            console.log('The reconnection failed: %s', err.message);
        });
        primus.on('end', function () {
            console.log('Connection closed');
        });
    }
}
export var sockSync = new SockSync();
