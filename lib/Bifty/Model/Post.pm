package Bifty::Model::Post;
use strict;
use warnings;
use base qw/Bifty::Record/;
use Bifty::Filter::Tags;
use Bifty::Model::User;
use Bifty::Model::CommentCollection;
use Scalar::Defer;
use DateTime;
use Jifty::DBI::Schema;
use Jifty::DBI::Record schema {

    column
        title => type is 'text',
        label is 'Title', default is 'Untitled Post';

    column author => refers_to Bifty::Model::User;

    column
        body => type is 'text',
        label is 'Content', render_as 'Textarea',
        default is 'A blog without words';

    column
        tags => type is 'text',
        label is 'Tags', render_as 'Textarea',
        input_filters are 'Bifty::Filter::Tags';

    column
        created_on => type is 'timestamp',
        label is 'Created On', default is defer { DateTime->now },
        filters are 'Jifty::DBI::Filter::DateTime', render_as 'text';

    column comments => refers_to Bifty::Model::CommentCollection by 'post';

};

sub canonicalize_tags {
    my $self = shift;
    my $tags = shift;
    return Bifty::Filter::Tags->canonicalize($tags);
}

sub before_create {
    my $self = shift;
    my $args = shift;
    $args->{author} = $self->current_user->user_object;
    return 1;
}

sub current_user_can {
    my $self  = shift;
    my $right = shift;
    return 1 if $right eq 'read';
    if ( $self->current_user->username ) {
        if ( $right eq 'create' ) {
            return 1;
        }
        else {    # $right is 'delete' or 'update'
            return 1
                if ( $self->current_user->user_object->id eq
                $self->__value('author') );
        }
    }
    return 0;
}


1;

