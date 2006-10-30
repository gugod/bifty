package Bifty::Model::Comment;
use strict;
use warnings;

use base qw/Bifty::Record/;

use Jifty::DBI::Schema;
use Bifty::Model::User;
use Bifty::Model::Post;
use Scalar::Defer;
use DateTime;
use Jifty::Record schema {

    column author => refers_to Bifty::Model::User;

    column
        body => type is 'text',
        label is 'Comment', render_as 'Textarea', is mandatory;

    column
        created_on => type is 'timestamp',
        label is 'Created On', default is defer { DateTime->now },
        filters are 'Jifty::DBI::Filter::DateTime', render_as 'text';

    column post => refers_to Bifty::Model::Post;
}

sub since {'0.0.2'}

sub before_create {
    my $self = shift;
    my $args = shift;
    $args->{author} = $self->current_user->user_object;
    return 1;
}

sub current_user_can {
    my $self  = shift;
    my $right = shift;
    return 1 if ( $right eq 'read' );
    if ( $self->current_user->username ) {
        return 1 if $right eq 'create';
    }
    else {    # $right is 'delete' or 'update'
        return 1
            if (
            $self->current_user->user_object->id eq $self->__value('author')
            );
    }
    return 0;
}

1;

