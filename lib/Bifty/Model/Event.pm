package Bifty::Model::Event;
use strict;
use warnings;
use base qw/Bifty::Record/;
use Bifty::Filter::Tags;
use Bifty::Model::User;
use Scalar::Defer;
use DateTime;
use Jifty::DBI::Schema;
use Jifty::DBI::Record schema {

    column
        name => type is 'text',
        default is 'unknown';

    column author => refers_to Bifty::Model::User;

    column
        tags => type is 'text',
        label is 'Tags',
        input_filters are 'Bifty::Filter::Tags';

    column created_on =>
        type is 'timestamp',
        is immutable,
        filters are 'Jifty::DBI::Filter::DateTime';

    column
        body => type is 'text',
        label is 'Content',
        default is '';

};

sub since { '0.0.3' }

sub canonicalize_tags {
    my $self = shift;
    my $tags = shift;
    return Bifty::Filter::Tags->canonicalize($tags);
}

sub before_create {
    my $self = shift;
    my $args = shift;
    $args->{author} = $self->current_user->user_object
        unless exists($args->{author});
    $args->{created_on} = DateTime->now;
    return 1;
}

=item current_user_can

Event is an update-only model. No one can delete or update it's items.

=cut

sub current_user_can {
    my $self  = shift;
    my $right = shift;
    return 1 if $right eq 'read';
    return 1 if $right eq 'create';
    return 0;
}


1;
