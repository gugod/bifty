package Bifty::Filter::SHA;
use strict;
use warnings;
use base 'Jifty::DBI::Filter';
use Digest::SHA qw(sha256_hex);

sub encode {
    my $self = shift;
    my $value_ref = $self->value_ref;
    return unless $$value_ref;
    $$value_ref = sha256_hex($$value_ref);
    return 1;
}

sub decode {
}


1;
