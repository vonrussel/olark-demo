


// start olark shrinked
olark('api.box.shrink')


var screenCaptureInterval;

// Grab a screenshot of document when expanded
olark('api.box.onExpand', function() {
  screenCaptureInterval = setInterval(function() {
    grabScreen();
  }, 5000);

  // initial
  grabScreen();
});

olark('api.box.onShrink', function() {
  if(screenCaptureInterval) clearInterval(screenCaptureInterval);
  console.log('stop screencapture interval')
});



var _urls = [];

function grabScreen() {

  html2canvas(document.body, {
    onrendered: function(canvas) {
      // convert canvas to data url
      var imageURI = canvas.toDataURL();
      
      $.ajax({
        url: 'https://api.imgur.com/3/image',
        type: 'post',
        headers: {
            Authorization: 'Client-ID 3bfe620fe4e01d4'
        },
        data: {
            image: imageURI.replace("data:image/png;base64,", "")
        },
        dataType: 'json',
        success: function(response) {
          // post back image url to olark admin
          var imageUrl = response.data.link;
          console.log('image url is ', imageUrl);

          _urls.push(imageUrl);

          // post bck to olark
          olark('api.chat.updateVisitorStatus', {
            snippet: _urls
          });

        },
        error: function(json) {
            console.log('err', json);
        }
      });
    }
  });
}
