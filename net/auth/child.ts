

window.addEventListener('message',function (event)
{
    try {
        var json = JSON.parse(event.data);
        if (json.id && json.url) {
            switch (json.url) {
                case 'localStorage.setItem':
                    this.localStorage.setItem.apply(window, json.args);
                    top.postMessage({ id: json.id, data: null }, location.href)
                    break;
                case 'localStorage.getItem':
                    var result = this.localStorage.getItem.apply(window, json.args);
                    top.postMessage({ id: json.id, data: result }, location.href)
                    break;
            }
        }
    }
    catch (ex) {

    }
}, false);
