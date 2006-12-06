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

Widget.TagCloud.show = function(data, param) {
    var tc = new Widget.TagCloud()
    tc.data(data)
    tc.create()
    return tc.show(param)
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

  # OO-style
  var tc = new Widget.TagCloud()
  tc.data(data)
  tc.create()
  tc.show()

=head1 DESCRIPTION

This is a pure javascript implementation of tag cloud. It creates
markups and CSS for you so you don't need to worry about it too much.
The simplest usage looks like this:

    Widget.TagCloud.show(data)

This appends a new div to document.body. If you would like to control
that, you could say something like:

    var elem = document.getElementById("my-tag-cloud-div")
    Widget.TagCloud.show(data, { parentNode: elem })

That would append a new div to element C<elem>.

The format of data is like this:

    var data = [
        { tag: "Foo", url: "/tag/Foo", count: 10 },
        { tag: "Bar", url: "/tag/Bar", count: 20 },
        { tag: "Baz", url: "/tag/Baz", count: 30 }
    ];

It's a array of hash. Each element has 3 keys: tag, url, count.  tag
and url will be used to create a link element. count will be used to
show different font size. Required CSS are dynamically generated.

If you prefer more OO-ish way, here's 4 required steps:

First, create an object:

  var tc = new Widget.TagCloud()

Second and third, create markup:

  tc.data(data)
  tc.create()

Last, put into document.body

  tc.show()

Again, show() method could have parameter indicating the parent node
of tag cloud div:

  tc.show({ parentNode: elem })

That's about everything you should now to use this library. Please
give me some feedback about any kinds suggesstions.

=head1 AUTHOR

Kang-min Liu, <gugod@gugod.org>

=head1 COPYRIGHT

Copyright (c) 2006 Kang-min Liu. All rights reserved.

This module is free software; you can redistribute it and/or modify it under
the same terms as the Perl programming language (your choice of GPL or the
Perl Artistic license).

=cut

*/
