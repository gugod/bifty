if ( typeof Widget == "undefined" )
    Widget = {};

Widget.TagCloud = function(param){
    this.init(param);
    return this;
}

Widget.TagCloud.VERSION = '0.01'
Widget.TagCloud.EXPORT = []
Widget.TagCloud.EXPORT_OK = []
Widget.TagCloud.EXPORT_TAGS = {}

Widget.TagCloud.show = function(data) {
    var tc = new Widget.TagCloud()
    tc.data(data)
    tc.create()
    return tc.show()
}

Widget.TagCloud.prototype = (function(){return {
    init: function(param) {
        this.state = { inited: 1 }
        this._data = new Array();
    },
    create: function() {
        this.data(this._data.sort(function(a, b) {
            var ta = a.tag.toLowerCase()
            var tb = b.tag.toLowerCase()
            return ((ta > tb) ? 1 : (ta < tb) ? -1 : 0 )}))

        this.div = (function(data){
            var d = document.createElement("div")
            d.setAttribute("class", "jsan-widget-tagcloud")
            for (var i = 0; i < data.length ; i++) {
                var a = document.createElement("a")
                a.setAttribute("href", data[i].url)
                a.appendChild(document.createTextNode(data[i].tag))
                var s = document.createElement("span")
                s.setAttribute("class", "jsan-widget-tagcloud" + i)
                s.appendChild(a)
                d.appendChild(s)
                d.appendChild(document.createTextNode(" "))
            }
            return d
        })(this._data)

        this.style = (function(css){
            var s = document.createElement("style")
            s.setAttribute("type", "text/css")
            s.appendChild(document.createTextNode(css))
            return s
        })(this.css())
 
        this.state.created = 1
        return this
    },
    show: function(param) {
        if (!param)
            param = {}
        if (!param.parentNode)
           param.parentNode = document.body
        
        param.parentNode.appendChild(this.div)
        var head = ( document.getElementsByTagName("head") )[0]
        head.appendChild(this.style)
        this.state.shown = 1
    },
    hide: function() {
        if ( this.state.shown ) {
            document.body.removeChild(this.div)
            var head = ( document.getElementsByTagName("head") )[0]
            head.removeChild(this.style)
        }
    },
    add: function(tag, url, count) {
        this._data.push({tag: tag, url: url, count: count })
    },
    css: function() {
        var L = ".jsan-widget-tagcloud {line-height:1em;text-align:center;}\n.jsan-widget-tagcloud a {text-decoration: none;}\nYIELD\n"
        var T = ".jsan-widget-tagcloudLEVEL {font-size: SIZEpx;}\n"

        var rule = '';
        for(var i = 0; i < this._data.length; i++) {
            rule += T.replace(/LEVEL/, i).replace(/SIZE/, i + 12)
        }
        
        return L.replace(/YIELD/, rule)
    },
    data: function(data) {
        if ( data ) {
            this._data = data
        }
        return this._data
    }
}})()


/**

=head1 NAME

Widget.TagCloud - TagCloud effect made easy

=head1 SYNOPSIS

  # Just show something
  var tc = Widget.TagCloud.show(data)
  # Hide it
  tc.hide()

  # OO-style
  var tc = new Widget.TagCloud
  tc.data(data)
  tc.create()
  tc.show()
  # Hide it
  tc.hide()

=head1 DESCRIPTION

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

    Widget.TagCloud.show("Hello World");

It creates a default white box on top of a default grey transparent
background with "Hello World" inside. You may click anywhere to close
that hello-world lightbox, that is the default behaviour. Or if you're
doing some serious stuffs, here's the OO veresion of "Hello World":

    var box = new Widget.TagCloud;
    box.content("Hello World");
    box.show();

If you want to close the lightbox in the code, do this:

    box.hide();

If you have script.aculo.us effects library loaded, you could have fancy
effetcs using OO interface:

    var box = new Widget.TagCloud;
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
