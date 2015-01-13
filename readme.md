# slydeSho

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

Here’s a quick demonstration of how to build a rudimentary slideshow using the `block:on` and `block:off` events. The data associated with the block is passed through the first argument of the function.

```
slides.on('block:on', function(data) {
	$(data.block).css('display', 'block');
});

slides.on('block:off', function(data) {
	$(data.block).css('display', 'none');
});

slides.start();
```

## Custom loops

It's possible to define a custom loop by using the Loop helper. I find this useful for defining custom delays based upon attributes on the block element. You could store the timeout in your own implimentation, but the method below lets you utilize the pre-baked stop and pause methods.

```
// Data and element cache
var $block = $(_data.block);
var _delay = 500;

// Custom delay
if ( $block.is('[data-slide-delay]') ) {
    _delay = parseInt($block.attr('data-slide-delay'));
}

// Progress
slideshow.loop = setTimeout(slideshow.progress, _delay);
```

With this example we set the `delay` option to `false` which disables the built-in loop interval when calling `.start()`.

## Events

Events can be set like so:
```
slides.on('progress', callback);
slides.once('progress', callback);
slides.off('progress', callback);
```

- **block:on** Block is activated
- **block:off** Block is deactivated
- **progress** Slideshow has progressed

## Methods

Methods can be invoked like so:
```
slides.start();
```

- **start** Start the slideshow
- **stop** Stop the slideshow