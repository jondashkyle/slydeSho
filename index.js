/**
 * Dependencies
 */
var EventEmitter = require('events').EventEmitter;
var extend       = require('extend');

/**
 * Exports
 */
module.exports = function(opts) {

  /**
   * Events
   */
  var events = new EventEmitter();
  var on     = function(ev, cb) { events.on(ev, cb) };
  var once   = function(ev, cb) { events.once(ev, cb) }
  var off    = function(ev, cb) { events.removeListener(ev, cb) };

  /**
   * Options
   */
  var options = extend(true, {

    // Block elements for each slide
    'blocks' : [ ],

    // Default delay
    'delay' : 1500,

    // Looping
    'loop' : true

  }, opts);

  /**
   * Data
   */
  var data = {

    // Positions
    'positionActive' : 0,
    'positionLast'   : 0

  };

  /**
   * Loop contains the next progress event
   */
  var loop;

  /**
   * Progress
   * - Updates the position
   * - Sets the block on
   */
  var progress = function(_direction) {

    // Update the position
    data.positionLast   = data.positionActive;
    data.positionActive = (data.positionActive % options.blocks.length);

    // Direction we should progress
    if ( _direction === 'prev' ) {
      data.positionActive--;
    } else {
      data.positionActive++;
    }

    // Looping
    if ( options.loop ) {
      transport.loopStart();
    }

    // Event
    events.emit('progress');

  };

  /**
   * Blocks
   */
  var blocks = {

    /**
     * Make sure we have some blocks
     */
    check : function() {
      if ( options.blocks.length > 1 ) {
        return true;
      } else {
        return false;
      }
    }

  };

  /**
   * Block
   * - On/Off
   */
  var block = {

    /**
     * Get a block based on position within the block array
     */
    get : function(_position) {
      return options.blocks[_position-1];
    },

    /**
     * On
     */
    on : function(_position) {
      events.emit('block:on', {
        'block' : block.get(_position)
      });
    },

    /**
     * Off
     */
    off : function(_position) {
      events.emit('block:off', {
        'block' : block.get(_position)
      });
    }

  };

  /**
   * Helpers
   */
  var helpers = {

    blockActiveOn : function() {
      block.on(data.positionActive);
    },

    blockLastOff : function() {
      block.off(data.positionLast);
    },

    setLoop : function(_loop) {
      loop = _loop;
    },

    setDelay : function(_delay) {
      options.delay = _delay;
    }

  };

  /**
   * Transport
   */
  var transport = {

    start : function() {

      // Fail check
      if ( ! blocks.check() ) return;

      // Clear loop
      transport.loopStop();

      // Loop
      if ( options.delay && options.loop ) transport.loopStart();

      // Bind events
      events.on('progress', helpers.blockActiveOn);
      events.on('progress', helpers.blockLastOff);
      events.on('start', helpers.blockActiveOn);
      events.emit('start');

    },

    stop : function() {

      // Clear loop
      transport.loopStop();

      // Unbind events
      events.removeListener('start', helpers.blockActiveOn);
      events.removeListener('progress', helpers.blockActiveOn);
      events.removeListener('progress', helpers.blockLastOff);
      events.emit('stop');

    },

    loopStart : function() {
      transport.loopStop();
      loop = setTimeout(progress, options.delay);
    },

    loopStop : function() {
      clearTimeout(loop);
    }

  };

  /**
   * Public methods
   */
  return {

    'start'    : transport.start,
    'stop'     : transport.stop,
    'progress' : progress,
    'loop'     : loop,

    'on'    : on,
    'once'  : once,
    'off'   : off,

    'setLoop'  : helpers.setLoop,
    'setDelay' : helpers.setDelay

  };

};