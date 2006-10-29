package Bifty::Filter::Tags;
use strict;
use warnings;
use base 'Jifty::DBI::Filter';
use List::MoreUtils qw(uniq);

sub encode {
    my $self = shift;
    my $value_ref = $self->value_ref;
    return unless $$value_ref;
    $$value_ref = $self->canonicalize($$value_ref);
    return 1;
}

sub decode { }

sub canonicalize {
    my $class = shift;
    my $value = shift;
    return join " ", sort+uniq(split /\s+/, $value );
}

1;
