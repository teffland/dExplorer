/*
When the webpage loads, automatically analyze it for post recommendation
*/
$(function() {
    // add onClick handlers to all articles
    $('article').click(handlePostClick);

    // scrape the posts from the page
    console.log('Scraping page');
    var postsData = scrapePage();
    console.log('Calling posts with this data');
    console.log(postsData);

    // send posts data to server and get back doc similarities
    $.post({
        url: "https://localhost:5000/api/posts",
        data: JSON.stringify({
            'url':window.location.href,
            'postsData':postsData
        }),
        contentType: 'application/json;charset=UTF-8',
        success: function (data) {
          chrome.runtime.onMessage.addListener(
            function(message, sender, sendResponse) {
                switch(message.type) {
                    case "getPostsData":
                        console.log('getPostData' , data);
                        sendResponse(data);
                        break;
                    default:
                        console.error("Unrecognised message: ", message);
                }
            });
        }
    });

    // insert the panel
    insertPanel();
});

function scrapePage() {
    var postsData = [];
    $('article').each(function(index) {
        var post = $(this);

        //extract and join the paragraphs into one doc string
        var postText = post.find('p').map(function() {
                // convert breaks into newlines w/in paragraphs
                return $(this).html().replace(/<br\s*[\/]?>/gi, '\n');
            })
            .get()
            .join("\n\n");

        // a  post datum
        var postDatum = {
          'url':window.location.href,
          'post-id':post.data('postId'),
          'user-id':post.data('userId'),
          'post-text':postText
        };
        postsData.push(postDatum);
    });
    return postsData;
}

function handlePostClick() {
    //alert('clicked', $(this));
    console.log('click', $(this).data('postId'));
}

function insertPanel() {
    $.jsPanel({
            position:    {my: "center-top", at: "center-top", offsetY: 15},
        theme:       "rebeccapurple",
        contentSize: {width: 600, height: 350},
        headerTitle: "Example jsPanel",
        content:     "<p>Some sample text ...</p>",
        callback:    function () {
                    this.content.css("padding", "15px");
                        }
    });
}

