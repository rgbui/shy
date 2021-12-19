// 子进程代码(my.js文件)

var portList = [];
this.onconnect = function (e) {
    var port = e.ports[0];
    // portList.push(port);
    // console.log(port);
    port.addEventListener('message', function (e) {
        var data = e.data;
        if (data.url == 'register') {
            portList.push({ id: data.id, port });
        }
        // var workerResult = 'Result: ' + (e.data[0] * e.data[1]);
        // port.postMessage(workerResult);
    });
    port.addEventListener('abort', () => {

    })
    port.start(); // Required when using addEventListener. Otherwise called implicitly by onmessage setter.
}