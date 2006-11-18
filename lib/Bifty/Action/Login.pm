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
    my $email = $self->argument_value('email');
    unless ( defined $email ) {
        $self->result->error("No email, canont login");
        return;
    }

    my $user = Bifty::CurrentUser->new( email => $email );

    unless ( $user->id
             && $user->password_is($self->argument_value('password'))) {
        $self->result->error( 'You may have mistyped your email address or password. Give it another shot?' );
        return;
    }

    # Actually do the signin thing.
    Jifty->web->current_user($user);

    # Set up our login message
    $self->result->message("Welcome back, " . $user->username() . "." );

    # Event
    my $event = Bifty::Model::Event->new();
    my ($id, $status) = $event->create(
        name => 'login',
        user => $user->user_object,
    );

    return 1;
}

1;

