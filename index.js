/**
 * Dependencies
 */
var EventEmitter = require('events').EventEmitter
var extend       = require('extend')

/**
 * Exports
 */
module.exports = function(opts) {

  /**
   * Events
   */
  var events = new EventEmitter();
  var on     = function(ev, cb) { events.on(ev, cb) }
  var once   = function(ev, cb) { events.once(ev, cb) }
  var off    = function(ev, cb) { events.removeListener(ev, cb) }

  /**
   * Options
   */
  var options = extend(true, {

    // Block elements for each slide
    'blocks' : [ ],

    // Default delay
    'delay' : 1500,

    // Direction
    'reverse' : false,

    // Looping
    'loop' : true

  }, opts)

  /**
   * Data
   */
  var data = {

    // Positions
    'positionActive' : 0,
    'positionLast'   : -1,

    // Status
    'active' : false,
    'paused' : false

  }

  /**
   * Loop contains the next progress event
   */
  var loop

  /**
   * Progress
   * - Updates the position
   * - Sets the block on
   */
  var progress = function(_direction) {

    var _position;

    /**
     * Previous and next range checks
     */
    if ( options.reverse === true || _direction === 'prev' ) {
      if ( data.positionActive-1 <= options.blocks.length ) {
        _position = options.blocks.length
      } else {
        _position = data.positionActive-1
      }
    } else {
      if ( data.positionActive+1 >= options.blocks.length ) {
        _position = 0
      } else {
        _position = data.positionActive + 1
      }
    }

    // Looping
    if ( ! data.paused && options.loop ) {
      transport.loopStart()
    }

    // Event
    events.emit('progress')

    // Update the data
    data.positionLast   = data.positionActive
    data.positionActive = _position

  }

  /**
   * Blocks
   */
  var blocks = {

    /**
     * Make sure we have some blocks
     */
    check : function() {
      if ( options.blocks.length > 1 ) {
        return true
      } else {
        return false
      }
    }

  }

  /**
   * Block
   * - On/Off
   */
  var block = {

    /**
     * Get a block based on position within the block array
     */
    get : function(_position) {
      return options.blocks[_position]
    },

    /**
     * On
     */
    on : function(_position) {
      events.emit('block:on', {
        'block'    : block.get(_position),
        'position' : _position
      })
    },

    /**
     * Off
     */
    off : function(_position) {
      events.emit('block:off', {
        'block'    : block.get(_position),
        'position' : _position
      })
    }

  }

  /**
   * Helpers
   */
  var helpers = {

    blockActiveOn : function() {
      if ( data.positionLast !== data.positionActive ) {
        block.on(data.positionActive)
      }
    },

    blockLastOff : function() {
      if ( data.positionLast !== data.positionActive ) {
        block.off(data.positionLast)
      }
    },

    setActive : function(_position) {
      if ( _position === parseInt(_position) ) {
        data.positionActive = _position
      } else {
        console.warn('Please pass an integer')
      }
    },

    setBlocks : function(_blocks) {
      options.blocks = _blocks
    },

    setLoop : function(_loop) {
      if ( _loop !== 'undefined' ) {
        loop = _loop
      }
    },

    setDelay : function(_delay) {
      if ( _delay === parseInt(_delay) ) {
        options.delay = _delay
      } else {
        console.warn('Please pass an integer')
      }
    }

  }

  /**
   * Transport
   */
  var transport = {

    start : function() {

      // Fail check
      if ( ! blocks.check() || data.active ) {
        return
      }

      // Paused
      data.paused = false

      // Clear loop
      transport.loopStop()

      // Loop
      if ( options.delay && options.loop ) {
        transport.loopStart()
      }

      // Bind events
      events.emit('start')

      // Update the data
      data.active = true

    },

    pause : function() {

      // Clear loop
      transport.loopStop()

      // Unbind events
      events.emit('pause')

      // Update the data
      data.paused = true

    },

    resume : function() {
      data.paused = false
    },

    stop : function() {

      // Fail check
      // if ( ! data.active ) return

      // Clear loop
      transport.loopStop()

      // Unbind events
      events.emit('stop')

      // Update the data
      data.active = false

    },

    loopStart : function() {
      transport.loopStop()
      loop = setTimeout(progress, options.delay)
    },

    loopStop : function() {
      clearTimeout(loop)
    },

    /**
     * Go to the next block
     */
    next : function() {
      options.reverse = false
      progress('next')
    },

    /**
     * Go to the previous block
     */
    prev : function() {
      options.reverse = true
      progress('prev')
    }

  };

  /**
   * Events
   */
  events.on('progress', helpers.blockActiveOn)
  events.on('progress', helpers.blockLastOff)
  events.on('start', progress)

  /**
   * Public methods
   */
  return {

    'blocks' : options.blocks,

    'start'    : transport.start,
    'pause'    : transport.pause,
    'stop'     : transport.stop,
    'loop'     : loop,

    'next' : transport.next,
    'prev' : transport.prev,

    'on'    : on,
    'once'  : once,
    'off'   : off,

    'setBlocks' : helpers.setBlocks,
    'setActive' : helpers.setActive,
    'setLoop'   : helpers.setLoop,
    'setDelay'  : helpers.setDelay

  }

}