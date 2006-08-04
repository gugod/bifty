use strict;
use warnings;

=head1 NAME

Bifty::Action::Signup

=cut

package Bifty::Action::Signup;
use base qw/Bifty::Action Jifty::Action/;

use Jifty::Param::Schema;
use Jifty::Action schema {

param email =>
    label is 'Email address',
    is mandatory;

param name =>
    label is 'Name',
    is mandatory;

param password =>
    type is 'password',
    label is 'Password',
    is mandatory;

param password_confirm =>
    type is 'password',
    label is 'Password (Confirm)',
    is mandatory;

};

=head2 take_action

=cut

use Bifty::Model::User;

sub take_action {
    my $self = shift;
    if ( $self->argument_value('password')
         ne $self->argument_value('password_confirm') ) {
        $self->result->error("Two passwords mis-matched.");
        return;
    }

    my $record = Bifty::Model::User->new(current_user => Bifty::CurrentUser->superuser);
    my %values;
    $values{$_} = $self->argument_value($_)
        for grep { defined $record->column($_) and defined $self->argument_value($_) } $self->argument_names;
    my ($id) = $record->create(%values);

    # Handle errors
    unless ( $record->id ) {
        $self->result->error("Something bad happened and we couldn't create your account.  Try again later. We're really, really sorry.");
        return;
    }

    $self->result->message( "Welcome to Bifty, " . $record->name .".");

    return 1;
}

1;
