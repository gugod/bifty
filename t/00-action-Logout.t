#!/usr/bin/env perl
use warnings;
use strict;

=head1 DESCRIPTION

A (very) basic test harness for the Logout action.

=cut

use Jifty::Test tests => 1;

# Make sure we can load the action
use_ok('Bifty::Action::Logout');

