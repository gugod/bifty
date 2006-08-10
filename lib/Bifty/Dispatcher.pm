package Bifty::Dispatcher;
use Jifty::Dispatcher -base;

# Post feed: /feed/atom , /feed/rss/
on qr{^/feed/(atom|rss)}, run {
    set type => $1;
    show('/feed');
};

# All Comment feed: /feed/comment/atom
on qr{^/feed/comment/(atom|rss)}, run {
    set type => $1;
    set model => 'comment';
    show('/feed');
};

# Single post comment feed: /feed/comment/10/atom
on qr{^/feed/comment/(\d+)/(atom|rss)}, run {
    my $post = Bifty::Model::Post->new();
    $post->load_by_cols( id => $1 );
    set post => $post;
    set type => $2;
    set model => 'comment';
    show('/feed');
};

on qr{^/view/(list|full)}, run {
    set type => $1;
    show('/');
};

on qr{^/comment/(\d+)}, run {
    my $post = Bifty::Model::Post->new();
    $post->load_by_cols( id => $1 );
    set action => Jifty->web->new_action(
        class   => 'CreateComment'
    );
    set post => $post;
    show('/comment');
};

on qr'^/edit/(\d+)', run {
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

on 'signup', run {
    redirect('/') if ( Jifty->web->current_user->id );
    set 'action' =>
        Jifty->web->new_action( class => 'Signup',
                                moniker => 'signupbox' );

    set 'next' => Jifty->web->request->continuation
        || Jifty::Continuation->new(
        request => Jifty::Request->new( path => "/" ) );

};

on 'login', run {
    set 'action' =>
        Jifty->web->new_action( class => 'Login', moniker => 'loginbox' );
    set 'next' => Jifty->web->request->continuation
        || Jifty::Continuation->new(
        request => Jifty::Request->new( path => "/" ) );
};

before 'logout', run {
    Jifty->web->request->add_action(
        moniker => 'logout',
        class   => 'Logout'
    );
};

1;
