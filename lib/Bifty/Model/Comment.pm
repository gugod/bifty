use strict;
use warnings;

package Bifty::Model::Comment::Schema;
use Jifty::DBI::Schema;
use Bifty::Model::User;
use Bifty::Model::Post;
use Scalar::Defer;
use DateTime;

column author =>
    refers_to Bifty::Model::User;

column body =>
    type is 'text',
    label is 'Content',
    render_as 'Textarea',
    default is '',
    is mandatory;

column created_on =>
    type is 'timestamp',
    label is 'Created On',
    default is defer { DateTime->now },
    filters are 'Jifty::DBI::Filter::DateTime',
    render_as 'text';

column post =>
    refers_to Bifty::Model::Post;

package Bifty::Model::Comment;
use base qw/Bifty::Record/;


sub since { '0.0.2' }

sub current_user_can {
    my $self = shift;
    my $right = shift;
    return 1 if $self->current_user->username;
    if ( $right eq 'read' || $right eq 'create' ) {
        return 1;
    } else { # $right is 'delete' or 'update'
        return 1
            if ( $self->current_user->user_object->id eq $self->__value('author') )
    }
    return 0;
}

1;

