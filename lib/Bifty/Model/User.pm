package Bifty::Model::User;
use strict;
use warnings;
use base qw/Bifty::Record/;
use Digest::SHA qw(sha256_hex);
use Jifty::DBI::Schema;
use Jifty::Record schema {

    column
        name => type is 'text',
        label is 'Name', is mandatory, is distinct;

    column
        email => type is 'text',
        label is 'Email', is mandatory, is distinct;

    column
        password => type is 'text',
        label is 'Password', render as 'password',
        input_filters are 'Bifty::Filter::SHA';

};

sub username {
    my ($self) = @_;
    $self->__value('name');
}

sub password_is {
    my ( $self, $value ) = @_;
    my $enc = sha256_hex($value);
    return $self->__value('password') eq $enc;
}

sub auth_token {
    my $self     = shift;
    my $username = $self->username();
    return sha1_hex( $username . 'BiftySalt' );
}

1;

