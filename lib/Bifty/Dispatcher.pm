package Bifty::Dispatcher;
use Jifty::Dispatcher -base;

on qr{^/$}, run {
    redirect("/view");
};

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

on qr{^/view/(.*)}, run {
    my $author;
    my $type = $1;
    if ( $type !~ '^(list|full)$' ) {
        $author = $type;
        $type = 'list';
    }
    set type => $type;
    set author => $author;
    show('/view');
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

on qr'^/tags', run {
    my $tags = { };
    my $posts = Bifty::Model::PostCollection->new();
    $posts->unlimit();
    while ( my $post = $posts->next ) {
        for( split( /\s+/, $post->tags() ) ) {
            $tags->{$_}++;
        }
    }
    set 'tags' => $tags;
};

on qr'^/authors', run {
     my $authors = { };
     my $it = Bifty::Model::PostCollection->new();
     $it->unlimit();
     while ( my $i = $it->next ) {
         $authors->{ $i->author->username }++;
     }

     set 'authors' => $authors;
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
