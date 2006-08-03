use strict;
use warnings;

package Bifty::Model::Post::Schema;
use Jifty::DBI::Schema;
use Scalar::Defer;

# Your column definitions go here.  See L<Jifty::DBI::Schema> for
# documentation about how to write column definitions.

column title =>
    type is 'text',
    label is 'Title',
    default is 'Untitled Post';

column body =>
    type is 'text',
    label is 'Content',
    render_as 'Textarea',
    default is 'A blog without words';

column created_on =>
    type is 'timestamp',
    label is 'Created On',
    default is defer { DateTime->now },
    filters are 'Jifty::DBI::Filter::DateTime',
    render_as 'text';

package Bifty::Model::Post;
use base qw/Bifty::Record/;
use DateTime;

# Your model-specific methods go here.

1;

