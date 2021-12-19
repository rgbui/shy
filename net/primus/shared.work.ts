


var myWorker = new SharedWorker(VERSION_PREFIX + "assert/js/shared.js");
myWorker.port.start();
myWorker.port.addEventListener('message', function (e) {
    console.log(e.data);
});
myWorker.port.addEventListener('messageerror', function (e) {

});

