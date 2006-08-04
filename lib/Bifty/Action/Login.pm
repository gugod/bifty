use strict;
use warnings;

=head1 NAME

Bifty::Action::Login

=cut

package Bifty::Action::Login;
use base qw/Bifty::Action/;

use Jifty::Param::Schema;
use Jifty::Action schema {

param email =>
    label is 'Email address',
    is mandatory;

param password =>
    type is 'password',
    label is 'Password',
    is mandatory;

param remember =>
    type is 'checkbox',
    label is 'Remember me?',
    hints is 'If you want, your browser can remember your login for you',
    default is 0;

};

=head2 take_action

=cut

sub take_action {
    my $self = shift;

    my $user = Bifty::CurrentUser->new( email => $self->argument_value('email') );

    unless ( $user->id
             && $user->password_is($self->argument_value('password'))) {
        $self->result->error( 'You may have mistyped your email address or password. Give it another shot?' );
        return;
    }

    # Set up our login message
    $self->result->message("Welcome back, " . $user->user_object->name . "." );

    # Actually do the signin thing.
    Jifty->web->current_user($user);

    $self->report_success if not $self->result->failure;
    return 1;
}

=head2 report_success

=cut

sub report_success {
    my $self = shift;
    # Your success message here
    $self->result->message('Success');
}

1;

