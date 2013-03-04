jQuery(function($) {
    var imgCache = [];

    var $_activeImage;
    var $albumImage = $('#album-image .image-full');
    var $albumThumbsWrapper = $('#album-thumbs');
    var $albumThumbs = $('.album-thumb');
    var $loadingImage = null;
    
    var $activeThumb;
    $albumImage.load(
        function() {
            $albumImage.removeClass('loading');
        }
    );

    $albumThumbsWrapper.lionbars({autohide: true});
    $albumThumbsWrapper.css('height', '300px');

    $albumThumbs.click(function() {
        $activeThumb = $(this);

        var url = $activeThumb.data('xlurl');

        window.location.hash = $activeThumb.attr('id').split('-')[1];

        if (!imgCache[url]) {
            var img = new Image();


            $albumImage
                .css('background-image', '')
                .addClass('loading');

            $loadingImage = img;
            $(img).load(function() {
                $(this).data('loaded', true);
                if ($loadingImage != img) {
                    return;
                }
                loadImage($(this));
            });
            img.src = url;

            imgCache[url] = $(img);
        } else {
            loadImage(imgCache[url]);
        }
    });

    $(window).resize(loadImage);

    if (window.location.hash) {
       $('#image-' + window.location.hash.substr(1)).click();
    } else {
       $albumThumbs.eq(0).click();
    }

    function loadImage($img) {
        $img = $img && $img.size ? $img : $_activeImage;
        if ($img.size() == 0 || !$img.data('loaded')) {
            return;
        }

        $_activeImage = $img;

	var img = $img.get(0);

        var xPos = $albumThumbsWrapper.width() + (($(window).width() - $albumThumbsWrapper.width()) - img.width) / 2;

        if (xPos <= $albumThumbsWrapper.width() + 10) {
            xPos = $albumThumbsWrapper.width() + 10;
        }

        var contentBaseWidth = $albumThumbsWrapper.width() + 10;
        var imgWidth = img.width;
        var imgHeight = img.height;
        if (imgWidth + contentBaseWidth > $(window).width()) {
           imgWidth += Math.min(0, $(window).width() - imgWidth - contentBaseWidth);
        }

        imgHeight = img.height * (imgWidth / img.width);

        $albumImage.parent().show();

        $albumImage
            .hide()
            .css({
                'width':  imgWidth,
                'height': imgHeight
            })
            .removeClass('loading')
            .css({
                'background-image': 'url("' + img.src + '")'
            })
            .show();

        $('#page-content').css('width', (img.width + contentBaseWidth) + 'px');

        $albumThumbsWrapper.css('height', Math.max(imgHeight, $(window).height() - $('#header-wrapper').height() - 10) + 'px');

        $('.album-pinit').html(getPinString(null, img.src));


    }

    $('#hide-album-thumbs').click(function(){
        var $thumbs = $('#album-thumbs-wrapper');
        if ($thumbs.hasClass('hidden')) {
            $thumbs.show().removeClass('hidden');
        } else {
            $thumbs.data('width', $thumbs.width());
            $thumbs.hide().addClass('hidden');
        }
    });

    function getPinString(url, img) {
        var htmlString = '<a target="_blank" href="http://pinterest.com/pin/create/button/?url=PIN_URL&media=PIN_IMAGE" class="pin-it-button" count-layout="horizontal"><img border="0" src="//assets.pinterest.com/images/PinExt.png" title="Pin It" /></a>';
  
        if (!url) {
          url = encodeURIComponent(window.location);
        }
  
        return htmlString.replace(/PIN_URL/, url).replace(/PIN_IMAGE/, encodeURIComponent(img));
    }
});
