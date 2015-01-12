# Slydesho

`npm install slydesho`

A handy little utility to build a slideshows. Library agnostic. Doesn't preform any DOM manipulation, basically just keeps track of your slides and provides handy events to hook onto.

## Setup

```
var Slydesho = require('slydesho');

var slides = Slydesho({
	blocks : $('[data-blocks]'),
	delay : 1500
});
```

Require Slydesho. Create a new instance and pass an array of elements you want to keep track of in the options. This example is using jQuery to create that array.

## Example slideshow

```
slides.on('block:on', function(data) {
	$(data.block).css('display', 'block');
});

slides.on('block:off', function(data) {
	$(data.block).css('display', 'none');
});
```

Slydesho provides some useful events to build 

## Events and Methods

Event | Description
-------------  | -------------
block:on  | Block is activated
block:off  | Block is deactivated
progress | Slideshow has progressed

Method | Description
-------------  | -------------
start  | Start the slideshow
stop  | Stop the slideshow