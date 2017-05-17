chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "getPostsData"}, function(data) {
        console.log('data');
        console.log(data);
        $('div#data').html(function(data) {
          console.log(data);
          var html = ''
          if (data.error !== undefined) {
            html = '<div class="alert alert-danger" role="alert">Error: '+data.error+'</div>'
          }
          else {
            console.log(data);
            html = JSON.stringify(data);
          }
          return html;
        }(data));
    });
});
