use inc::Module::Install;
name('Bifty');
version('0.01');
requires('Jifty' => '0.60722',
         'Text::Markdown' => 0,
         'Digest::SHA'    => 0,
         'XML::Feed'      => 0,
	 'Text::Emoticon::MSN' => 0.04,
         'List::MoreUtils' => 0.22,
        );

auto_install;

WriteAll;
