# Warning: this is not yet usable at all.


# Yet Another Gallery

Yet another photo gallery.  Just because I didn't really like what I found elsewhere…


## Getting started

### Download the code

````Shell
git clone https://github.com/EricMountain/YetAnotherGallery.git
````

### Serve YAGallery from a web server

Make the YAGallery source files available from a web server, e.g. nginx:

```Nginx
    server {

        ...

        location /yagallery {
             alias  /srv/www/whatever/YAGallery;
             index  index.html;
        }
```

### Using YAGallery

Place the pictures to display in the gallery in a directory served by the web server.

Prepare JSON files describing the photos to display in the gallery.

<<TODO detail JSON format and easy way to generate>>

Navigate to the YAGallery URL, e.g. http://localhost/yagallery.

YAGallery is verified to work on recent versions of Chromium/Chrome
and Firefox.  It should work on Opera.

#### Keyboard shortcuts:

* <<TODO>>

## Developing YAGallery

### Setup nodejs

* In ~/.npmrc: prefix=~/.global_npm
* In ~/bashrc: export PATH=$PATH:~/.global_npm/bin

### Install required packages

e.g. on Arch:

* sudo pacman -S nodejs jdk7-openjdk libyaml ruby
* yaourt -S ruby-compass

### Install nodejs and bower packages

* npm install
* bower update

For the record, the original sequence was:
* npm install -g bower
* npm install -g yo
* npm install -g generator-angular
* npm install -g generator-angular-require
* npm install -g generator-protractor
* npm install karma-firefox-launcher --save-dev
* npm install karma-jasmine@2_0 --save-dev
* npm install grunt-protractor-runner --save-dev

### Building, testing…

Generating sample images:

http://www.imagemagick.org/Usage/text/#text_operators
convert -background lightblue -fill black -size 800x600 -gravity center label:1 1.jpg



#### Basics

* Build: grunt build
* Serve development local copy and launch in browser: grunt serve


#### Running automated tests

##### Unit tests

* grunt test

##### Integration tests

* Start the Selenium server: ./node_modules/.bin/webdriver-manager start
* Open a new terminal and run Protractor: ./node_modules/.bin/protractor protractor.conf.js

## Credits

YAGallery is built on top of the following:

- [HTML5 Boilerplate](http://html5boilerplate.com)
- [AngularJS](https://angularjs.org/)
- [CouchDB](http://couchdb.apache.org/)
- [jQuery](http://jquery.com/)
- [perfect-scrollbar](http://noraesae.github.io/perfect-scrollbar/)
- [angular-perfect-scrollbar](https://github.com/itsdrewmiller/angular-perfect-scrollbar)
- [RequireJS](http://requirejs.org/)
