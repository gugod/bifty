JSAN.use("DOM.Events");

if ( typeof Widget == "undefined" )
    Widget = {};

Widget.Lightbox = function(param) {
    this.win = window;
    this.doc = window.document;
    this.contentHTML = "";
    this.config = {
        clickBackgroundToHide: true
    };
    if ( param ) {
        if (param.divs ) {
            this.divs = {};
            for(var i in param.divs) {
                this.divs[i] = param.divs[i]
            }
            this.div = this.divs.wrapper;
            this.div.style.display="none";
        }
        if ( param.effects ) {
            this._effects = [];
            for (var i=0; i<param.effects.length; i++) {
                this._effects.push(param.effects[i]);
            }
        }
    }
    return this;
}

Widget.Lightbox.VERSION = '0.05';
Widget.Lightbox.EXPORT = [];
Widget.Lightbox.EXPORT_OK = [];
Widget.Lightbox.EXPORT_TAGS = {};

Widget.Lightbox.is_ie = function() {
    ua = navigator.userAgent.toLowerCase();
    is_ie = (
        ua.indexOf("msie") != -1 &&
        ua.indexOf("opera") == -1 &&
        ua.indexOf("webtv") == -1
    );
    return is_ie;
}();

Widget.Lightbox.show = function(param) {
    if ( typeof param == 'string' ) {
        var box = new Widget.Lightbox;
        box.content(param);
        box.show();
        return box;
    }
    else {
        var box = new Widget.Lightbox(param);
        box.show();
        return box;
    }
}

Widget.Lightbox.prototype.show = function(callback) {
    var div = this.create();
    if ( this.div.style.display== "none" )
        this.div.style.display="block";
    this.applyStyle();
    this.applyHandlers();
    this.applyEffects();

    if ( typeof callback == 'function') {
        callback(div);
    }
}

Widget.Lightbox.prototype.hide = function() {
    if (this.div.parentNode) {
        this.div.style.display="none";
        if (Widget.Lightbox.is_ie) {
            document.body.scroll="yes"
        }
    }
}

Widget.Lightbox.prototype.content = function(content) {
    if ( typeof content != 'undefined' ) {
        this._content = content;
    }
    return this._content;
}

Widget.Lightbox.prototype.create = function() {
    if (typeof this.div != 'undefined') {
        return this.div;
    }
    
    var wrapperDiv = this.doc.createElement("div");
    wrapperDiv.className = "jsan-widget-lightbox";

    var contentDiv = this.doc.createElement("div");
    contentDiv.className = "jsan-widget-lightbox-content";
    if ( typeof this._content == 'object' ) {
        if ( this._content.nodeType && this._content.nodeType == 1 ) {
            contentDiv.appendChild( this._content );
        }
    }
    else {
        contentDiv.innerHTML = this._content;
    }


    var contentWrapperDiv = this.doc.createElement("div");
    contentDiv.className = "jsan-widget-lightbox-content-wrapper";

    var bgDiv = this.doc.createElement("div");
    bgDiv.className = "jsan-widget-lightbox-background";

    contentWrapperDiv.appendChild(contentDiv);

    wrapperDiv.appendChild(bgDiv);
    wrapperDiv.appendChild(contentWrapperDiv);
    
    this.div = wrapperDiv;
    this.divs = {
        wrapper: wrapperDiv,
        background: bgDiv,
        content: contentDiv,
        contentWrapper: contentWrapperDiv
    };
    wrapperDiv.style.display = "none";
    this.doc.body.appendChild(wrapperDiv);
    return this.div;
}


Widget.Lightbox.prototype.applyStyle = function() {
    var divs = this.divs;
    with(divs.wrapper.style) {
        position= Widget.Lightbox.is_ie ? 'absolute': 'fixed';
        top=0;
        left=0;
        width='100%';
        height='100%';
        padding=0;
        margin=0;
    }
    with(divs.background.style) {
        position="fixed";
        background="#000";
        opacity="0.7";
        top=0;
        left=0;
        width="100%";
        height="100%";
        zIndex=2000;
        padding=0;
        margin=0;
    }
    with(divs.contentWrapper.style) {
        position="relative";
        top='0';
        left='0';
        zIndex=2001;
        background='#fff';
        padding=0;
        margin='100px auto';
        width='500px';
        border="1px outset #555";
    }

    with(divs.content.style) {
        margin='5px';
    }
    if(Widget.Lightbox.is_ie) {
        document.body.scroll="no";

        var win_height = document.body.clientHeight;
        var win_width = document.body.clientWidth;
        var my_width = divs.content.offsetWidth;
        var my_left = (win_width - my_width) /2;
        my_left = (my_left < 0)? 0 : my_left + "px";

        with (divs.contentWrapper.style) {
            position= "absolute";
            left = my_left;
        }

        with (divs.background.style) {
            position= "absolute";
            filter = "alpha(opacity=70)";
        }
    }
}

Widget.Lightbox.prototype.applyHandlers = function(){
    if(!this.div)
        return;

    var self = this;

    if ( this.config.clickBackgroundToHide == true ) {
        DOM.Events.addListener(this.divs.background, "click", function () {
            self.hide();
        });
    }
    if (Widget.Lightbox.is_ie) {
        DOM.Events.addListener(window, "resize", function () {
            self.applyStyle();
        });
    }
}

Widget.Lightbox.prototype.effects = function() {
    if ( arguments.length > 0 ) {
        this._effects = [];
        for (var i=0; i<arguments.length; i++) {
            this._effects.push(arguments[i]);
        }
    }
    return this._effects;
}

Widget.Lightbox.prototype.applyEffects = function() {
    if (!this._effects)
        return;
    for (var i=0;i<this._effects.length;i++) {
        this.applyEffect(this._effects[i]);
    }
}

Widget.Lightbox.prototype.applyEffect = function(effect) {
    var func_name = "applyEffect" + effect;
    if ( typeof this[func_name] == 'function') {
        this[func_name]();
    }
}

// Require Effect.RoundedCorners
Widget.Lightbox.prototype.applyEffectRoundedCorners = function() {
    divs = this.divs
    if ( ! divs ) { return; }
    if ( typeof Effect.RoundedCorners == 'undefined' ) { return; }
    divs.contentWrapper.style.border="none";
    var bs = divs.contentWrapper.getElementsByTagName("b");
    for (var i = 0; i < bs.length; i++) {
        if(bs[i].className.match(/rounded-corners-/)) {
            return;
        }
    }
    for (var i=1; i< 5; i++) {
        Effect.RoundedCorners._Styles.push(
            [ ".rounded-corners-" + i,
              "opacity: 0.7",
              "filter: alpha(opacity=70)"
             ]
        );
    }

    Effect.RoundedCorners._addStyles();
    Effect.RoundedCorners._roundCorners(
        divs.contentWrapper,
        {   'top': true,
            'bottom':true,
            'color':'black'
            }
        );
}

// A Generator function for scriptaculous effects.
;(function () {
    var effects = ['Appear', 'Grow', 'BlindDown', 'Shake'];
    for (var i=0; i<effects.length; i++) {
        var name = "applyEffect" + effects[i];
        Widget.Lightbox.prototype[name] = function(effect) {
            return function() {
                if ( ! this.divs ) { return; }
                if ( typeof Effect[effect] == 'undefined' ) { return; }
                if (effect != 'Shake') 
                    this.divs.contentWrapper.style.display="none";
                Effect[effect](this.divs.contentWrapper, { duration: 2.0 });
            }
        }(effects[i]);
    }
})();



/**

=head1 NAME

Widget.Lightbox - Lightbox effect made easy

=head1 SYNOPSIS

  # Just show something
  var box = Widget.Lightbox.show(contentHTML);
  # Hide it
  box.hide();

  # Use existing divs
  var divs = {
      wrapper: $('my-wrapper'),
      background: $('my-background'),
      contentWrapper: $('my-content-wrapper'),
      content: $('my-content')
  }
  var box = new Widget.Lightbox.show({
      'divs': divs,
      'effects': ['RoundedCorners']
  });
    
  # OO-style
  var box = new Widget.Lightbox;
  box.content(contentHTML);
  box.show();

  # different box effects and tyles
  var box = new Widget.Lightbox();
  box.effect('RoundedCorners');
  box.content(contentHTML);
  box.show();


=head1 DESCRIPTION

C<Widget.Lightbox> is an objective re-implementation of C<Lightbox JS>
(L<http://www.huddletogether.com/projects/lightbox/>). It has several
nice features:

=over 4

=item Requires no extra image files

=item Requires no extra CSS files and rules

=item Optionally supports script.aculo.us effects library.

=item Optionally supports JSAN effects library.

=item Works on IE, Firefox, and Safari.

=back

It's made easy to use for javascript programmers who wants to show off
some cool stuff quickly with too much bothering about CSS and IE
issues.

Here's the code for a "Hello World" lightbox:

    Widget.Lightbox.show("Hello World");

It creates a default white box on top of a default grey transparent
background with "Hello World" inside. You may click anywhere to close
that hello-world lightbox, that is the default behaviour. Or if you're
doing some serious stuffs, here's the OO veresion of "Hello World":

    var box = new Widget.Lightbox;
    box.content("Hello World");
    box.show();

If you want to close the lightbox in the code, do this:

    box.hide();

If you have script.aculo.us effects library loaded, you could have fancy
effetcs using OO interface:

    var box = new Widget.Lightbox;
    box.content("Hello World");
    box.effects("Appear");
    box.show();

The C<box.effects()> methods sets the effect that will be applied to
the box when it's showing. It takes strings which means effect
names. Currently support values are: 'Appear', 'Grow', 'BlindDown',
'Shake', and 'RoundedCorners'. Except for 'RoundedCorners', which is
available on JSAN as C<Effect.RoundedCorners>, the rest four are
availale in script.aculo.us effects library. You must load these
libraries on your own if you want to see these
effects.

C<'RoundedCorners'> could be combined with others. For example:

    box.effects('RoundedCorners', 'Appear');

This means to have a box with rounded corners fading in.

By default Widget.Lightbox creates required structure of divs
automatically, but sometimes you may need to create them
first. You could tell Widget.Ligthbox to just apply lightbox
style and effects on your existing divs. Like this:

    # Use existing divs
    var divs = {
        wrapper: $('my-wrapper'),
        background: $('my-background'),
        contentWrapper: $('my-content-wrapper'),
        content: $('my-content')
    }
    var box = new Widget.Lightbox.show({
        'divs': divs,
        'effects': ['RoundedCorners']
    });
  
C<Widget.Lightbox.show()> takes a parameter hash. 'divs' key refers to
a divs hash, 'effects' key refer to a array of effects. You need to
get the element object of each divs first. Four divs are required:
wrapper, background, contentWrapper, content. In HTML, they are
structured like this:

    <div id="my-wrapper">
      <div id="my-background"></div>
      <div id="my-content-wrapper">
        <div id="my-content">
            <!-- The actual lightbox content goes in here -->
        </div>
      </div>
    </div>
    
You need to layout your divs like this to let effects and style be
applied correctly.

That's pretty much about everything you should know to use this
library.

=head1 AUTHOR

Kang-min Liu, <gugod@gugod.org>

=head1 COPYRIGHT

Copyright (c) 2006 Kang-min Liu. All rights reserved.

This module is free software; you can redistribute it and/or modify it under
the same terms as the Perl programming language (your choice of GPL or the
Perl Artistic license).

=cut

*/
