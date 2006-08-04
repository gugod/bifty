package Bifty::Filter::Tags;
use strict;
use warnings;
use base 'Jifty::DBI::Filter';

sub encode {
    my $self = shift;
    my $value_ref = $self->value_ref;
    return unless $$value_ref;
    $$value_ref = join " ", sort split /\s+/, lc($$value_ref) ;
    return 1;
}

sub decode {
    return;
}

1;
