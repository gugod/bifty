/* Put your application's custom JS here... */
JSAN.use("Effect.RoundedCorners");

Bifty = {}


Bifty.Textarea = {
    'min_height': 80
}

Bifty.textarea_resize = function(element) {
    var bottom = window.innerHeight - 100;
    var top = element.offsetTop;
    var h = bottom - top;
    if ( h > Bifty.Textarea.min_height ) {
        element.style.height = h + 'px';
    } 
}

Bifty.textarea_setup = function(element) {
    Bifty.textarea_resize( element );
    window.onresize = function() {
        Bifty.textarea_resize( element );
    };
}

Bifty.Post = {
    _previewing: false,
    preview: function() {
        if ( Bifty.Post._previewing == true ) {
            return
        }

        Bifty.Post._previewing = 1;
        var area = cssQuery('#content form textarea.argument-body')[0]
        var showResponse = function(req) {
            var _ = JSON.parse(req.responseText);

            var box = new Widget.Lightbox;
            box.effects("RoundedCorners");
            box.content("<h1 class=\"entry-title\">Preview</h1><div class=\"entry\" style=\"text-align:left;\"><div class=\"entry-body\" style=\"font-size:11pt;\">" + _.preview + "</div></div><p>Click grey area to close preview.</p>")

            box.show(function() {
                DOM.Events.addListener(box.divs.background, "click", function () {
                    Bifty.Post._previewing = false;
                })});

        }

        var pars = "text=" + area.value;
        var url = "/fragments/post_preview";
        new Ajax.Request(url, {
            method: 'post',
            parameters: pars,
            onComplete: showResponse
        });

    }
}
