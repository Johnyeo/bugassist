// inject injected script
var s = document.createElement('script');
s.src = chrome.runtime.getURL('injected.js');
s.onload = function () {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);
 
// receive message from injected script
window.addEventListener('message', function (e) {
    if (chrome.runtime.id === undefined) {
        console.log('扩展已失效，不再处理消息');
        return;
    }

    var contentData = e.data.data
    // console.log('contentData -------------', e.data.data)
    try{
        var contentDataObject = JSON.parse(contentData)
    }catch(SyntaxError){
        console.log('json解析错误',SyntaxError)
        var contentDataObject = contentData
    }
    
    // console.log('contentDataObject.requestData ---- ', contentDataObject.requestData)
    // console.log('contentDataObject.responseData ---- ', contentDataObject.responseData)

    if(contentDataObject.requestData === undefined || contentDataObject.responseData === undefined){
        console.log('不是json不处理 ---------- ', contentData)
        return;
    }

    let sendMessages = {   
        type: 'xhrRequest',
        data: contentData
    }
    // console.log('content.js / contentData', contentData)
    // 发送消息到 background.js
    chrome.runtime.sendMessage( sendMessages , function(response) {
        // 在收到 background.js 的响应后，可以在此处理
        // console.log('response ---- ', sendMessages)
    });

});
