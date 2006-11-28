/* Put your application's custom JS here... */

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

