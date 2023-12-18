document.addEventListener('DOMContentLoaded', function() {
    var clearButton = document.getElementById('clear');
    var list = document.getElementById('requests');

    clearButton.addEventListener('click', function() {
        list.innerHTML = ''; // 清空列表
        // 清空background.js里保存的requests
        chrome.runtime.sendMessage({type: 'clearRequests'}, function(response){
            console.log('clearRequests ----- ',response)
        })

    });

    // 获取信息
    chrome.runtime.sendMessage({type: "getRequests"}, function(response) {
        var list = document.getElementById('requests');
        list.innerHTML = '';  // 清空列表

        response.forEach(function(requestDetail) {
            const requestDetailJsonData = JSON.parse(requestDetail);
            
            let requestData = requestDetailJsonData.requestData
            let responseData = JSON.stringify(requestDetailJsonData.responseData, null, 2)

            console.log('requestData ------------- ', requestData)
            // console.log('responseData ------------- ', responseData)
            if (typeof body === 'undefined') {
              // console.log('myVar 是 undefined');
            } else {
              // console.log('myVar 不是 undefined')
            };

            // var body = requestData[1].body; 
            var body = requestData.body
            if (typeof body === 'undefined') {
                body = '无'
            } else {
                try {
                    body = JSON.stringify(JSON.parse(body), null, 2) 

                } catch (SyntaxError) {
                    console.log("解析错误", SyntaxError)
                }
            }
            
            var li = document.createElement('li');
            var url = decodeURIComponent(requestData.url);
            var method = requestData.method;

            // URL链接
            var url_span = document.createElement('span')
            url_span.className = 'url-text'
            url_span.textContent = url

            // 按钮
            var reportButton = document.createElement('button');
            reportButton.textContent = 'Copy';
            reportButton.className = 'copy-btn';

            //请求方法
            var method_tag = document.createElement('span');
            method_tag.textContent = method;

            if (method === 'GET'){
                method_tag.className = 'method-tag-get'
            }else if (method === 'POST' || method === 'PUT'){
                method_tag.className = 'method-tag-post'
            }else if (method === 'DELETE'){
                method_tag.className = 'method-tag-delete'
            }else{
                method_tag.className = 'method-tag-other'
            }

            li.appendChild(method_tag);
            li.appendChild(url_span);
            li.appendChild(reportButton);

            // 获取要插入的参考节点（即当前第一个子元素）
            let referenceNode = list.firstChild;

            // 在参考节点之前插入新的子元素
            list.insertBefore(li, referenceNode);


            reportButton.addEventListener('click', function() {
                console.log(requestDetail)
                copyToClipboard(formatRequestDetails(url, method, body, responseData));
            });

        });
    });
});


function formatRequestDetails(url, method, body, responseData) {
    // 检查details对象的属性，并相应地进行调整
    // 以下是一个示例格式化方法，您需要根据实际数据结构调整
    return `${method}:\n ${url} \n参数: \n${body} \n响应： \n${responseData}`;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        console.log('Copied to clipboard');
    }).catch(function(err) {
        console.error('Error in copying text: ', err);
    });
}
