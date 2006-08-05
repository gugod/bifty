package Bifty::Dispatcher;
use Jifty::Dispatcher -base;

on qr{^/comment/(.*)}, run {
    my $args = Jifty->web->request->arguments;
    my $post = Bifty::Model::Post->new();
    $post->load_by_cols( id => $1 );
    set action => Jifty->web->new_action(
        class   => 'CreateComment'
    );
    set post => $post;
    show('/comment');
};

on qr'^/edit/(.*)', run {
    my $post = Bifty::Model::Post->new();
    $post->load_by_cols( id => $1 );
    set 'action' =>
        Jifty->web->new_action(class => 'UpdatePost', record => $post );
    show('/edit');
};

before 'post', run {
    set 'action' =>
        Jifty->web->new_action(class => 'CreatePost');
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
