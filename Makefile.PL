use inc::Module::Install;
name('Bifty');
version('0.01');
requires('Jifty' => '0.60722',
         'Text::Markdown' => 0,
        );

WriteAll;
