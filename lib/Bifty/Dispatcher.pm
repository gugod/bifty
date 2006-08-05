package Bifty::Dispatcher;
use Jifty::Dispatcher -base;

before 'post', run {
    set 'action' =>
        Jifty->web->new_action(class => 'CreatePost');
};

before 'edit', run {
    my $args = Jifty->web->request->arguments;
    my $post = Bifty::Model::Post->new();
    $post->load_by_cols( id => $args->{post} );
    set 'action' =>
        Jifty->web->new_action(class => 'UpdatePost', record => $post );
};

# Sign up for an account
on 'signup', run {
    redirect('/') if ( Jifty->web->current_user->id );
    set 'action' =>
        Jifty->web->new_action( class => 'Signup',
                                moniker => 'signupbox' );

    set 'next' => Jifty->web->request->continuation
        || Jifty::Continuation->new(
        request => Jifty::Request->new( path => "/" ) );

};

# Login
on 'login', run {
    set 'action' =>
        Jifty->web->new_action( class => 'Login', moniker => 'loginbox' );
    set 'next' => Jifty->web->request->continuation
        || Jifty::Continuation->new(
        request => Jifty::Request->new( path => "/" ) );
};

# Log out
before 'logout', run {
    Jifty->web->request->add_action(
        moniker => 'logout',
        class   => 'Logout'
    );
};

1;
