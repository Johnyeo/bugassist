(function (xhr) {

    var XHR = XMLHttpRequest.prototype;

    var open = XHR.open;
    var send = XHR.send;

    XHR.open = function (method, url) {
        this._method = method;
        this._url = url;
        return open.apply(this, arguments);
    };

    XHR.send = function (postData) {
        console.log('injected.js: injected script xhr request:', this._method, this._url, this.getAllResponseHeaders(), postData);
        
        this.addEventListener('load', function () {

            let requestData = {
            url: this._url,
            method: this._method, 
            body: postData
            }

            let responseData = JSON.parse(this.response)

            let sendData = {'requestData':requestData, 'responseData': responseData}

            let sendDataAsString = JSON.stringify(sendData);

            window.postMessage({type: 'xhr', data: sendDataAsString}, '*');  // send to content script
        });
        return send.apply(this, arguments);
    };
})(XMLHttpRequest);



const { fetch: origFetch } = window;
window.fetch = async (...args) => {
    const response = await origFetch(...args);
    // console.log('injected.js: injected script fetch request:', args);

    response
        .clone()
        .blob() // maybe json(), text(), blob()
        .then(data => {
            
            data.text().then(text => {
                let jsonData;
                if (parseInt(args.length) > 1){
                    jsonData = JSON.parse(text);       
                    let requestData = {
                        url: args[0],
                        method: args[1].method, 
                        body: args[1].body
                    } 
                    // console.log('requestData ------------', requestData)
                    // console.log('responseData ------------', jsonData)    

                    let sendData = {'responseData':jsonData, 'requestData': requestData} 

                    let sendDataAsString = JSON.stringify(sendData);
                    window.postMessage({ type: 'fetch', data: sendDataAsString}, '*'); // send to content script        
                    //window.postMessage({ type: 'fetch', data: URL.createObjectURL(data) }, '*'); // if a big media file, can createObjectURL before send to content script
                }        
          
            });
        })
        .catch(err => console.error(err));
    return response;

};
