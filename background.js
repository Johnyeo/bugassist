let requests = [];

// 监听来自弹出页面的消息
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // 获取所有的请求、响应
        if (request.type === "getRequests") {
          console.log('background.js  requests ------------', requests)
          sendResponse(requests);
        }

        //从content.js获取
        if (request.type === 'xhrRequest') {
          const contentData = request.data;
          console.log('background.js  contentData ------------ ', contentData)
          requests.push(contentData);
        }

        //清理requests
        if (request.type === 'clearRequests') {
          requests = []  
        }

    } 
);

// 收到从content.js获取的，然后发送到pop.js