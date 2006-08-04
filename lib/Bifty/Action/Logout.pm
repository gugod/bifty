use strict;
use warnings;

=head1 NAME

Bifty::Action::Logout

=cut

package Bifty::Action::Logout;
use base qw/Bifty::Action Jifty::Action/;

=head2 take_action

=cut

sub take_action {
    my $self = shift;
    Jifty->web->current_user(undef);
    return 1;
}

1;
