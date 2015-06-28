# Lilum: A really light weight JavaScript framework, based on [ES6](https://en.wikipedia.org/wiki/ECMAScript)

## Why should you write your own library when there is quite a lot JavaScript frameworks, really....

First, I want to have a small and light weight and modulized JavaScript framework for my little php framework [clips-tool](http://github.com/guitarpoet/clips-tool).

For this JavaScript framework, I really need these functions:

1. Based on ES6: Sure, since ES4 is such a mess, ES5 is such an asshole, why don't we have a little break on ES6(since, it has already been done and many vendors promised to support it)? ES6 is not only about syntax sugars(yes, I like sugars! yeah!), it is a big revolution for writing JavaScript, it makes almost most so called "JavaScript Framework" useless.
2. Have a small and effective Event System, that support most modern browser's dom event system
3. Highly modulized and highly customizable about the module configurations, and yes, no modulize JavaScript framework meet my needs, isn't they?
4. Smart DataStore that handles data stored in headers, page context, cookie and local storage(maybe flash's local storage too), and have the ability to do sync or async databindings(using ajax through ES6's promise)

And, yet, I found none! So I tried to start a new one.

## Install

To compile or test lilium, you'll need:

1. Have [nodjs](http://nodejs.org) installed: The command line JavaScript runtime
2. Have [npm](http://www.npmjs.com) installed: You'll need this to install other dependencies of Lilium
3. Have [jasmine](http://jasmine.github.io) installed: Lilium use this to do the unit test
4. Have [GNU Make](https://www.gnu.org/software/make/) install: Lilium use this to build

Then, you'll need:

1. Run this command in Lilium's folder
	
	npm install

2. Run the makefile

	make build

3. Then test
	
	make test
