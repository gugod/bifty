use strict;
use warnings;

package Bifty::Model::Post::Schema;
use Jifty::DBI::Schema;
use Bifty::Model::User;
use Scalar::Defer;
use DateTime;

column title =>
    type is 'text',
    label is 'Title',
    default is 'Untitled Post';

column author =>
    refers_to Bifty::Model::User;

column body =>
    type is 'text',
    label is 'Content',
    render_as 'Textarea',
    default is 'A blog without words';

column tags =>
    type is 'text',
    label is 'Tags',
    render_as 'Textarea',
    input_filters are 'Bifty::Filter::Tags' ;

column created_on =>
    type is 'timestamp',
    label is 'Created On',
    default is defer { DateTime->now },
    filters are 'Jifty::DBI::Filter::DateTime',
    render_as 'text';

package Bifty::Model::Post;
use base qw/Bifty::Record/;

sub before_create {
    my $self = shift;
    my $args = shift;
    $args->{author} = $self->current_user->user_object;
    return 1;
}

sub current_user_can {
    my $self = shift;
    my $right = shift;
    return 1 if $self->current_user->username;
    return 1 if $right eq 'read';
    return 0;
}

1;

