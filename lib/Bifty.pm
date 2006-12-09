package Bifty;
use Jifty;
use strict;
use warnings;

sub start {
    Jifty->web->javascript_libs(
        [   @{ Jifty->web->javascript_libs }, "yui/tabview.js",
            "Effect/RoundedCorners.js",       "Widget/TagCloud.js",
            "Widget/Lightbox.js"
        ]
    );
}

1;
