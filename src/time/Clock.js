/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Clock constructor.
*
* @class Phaser.Clock
* @classdesc This represent a generic clock able to track time in various reference.
* @constructor
* @param {Phaser.Game} game A reference to the currently running game.
*/
Phaser.Clock = function (game) {

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = game;

    /**
    * @property {number} time - The current time of the clock with respect to the moment the timer was created (in ms).
    * @readonly
    */
    this.now = 0;

    /**
    * @property {number} timeScale - Allow to accelerate or slow-down a clock. Time represented by this clock will go timeScale faster than normal.
    */
    this.timeScale = 1;

    /**
    * @property {boolean} paused - Is the clock paused ? The update function of a paused clock does nothing.
    */
    this.paused = false;

    /**
    * @property {Phaser.Timer} events - This is a Phaser.Timer object bound to the master clock to which you can add timed events.
    */
    this.events = new Phaser.Timer(this.game, false, this);

    /**
    * @property {array} _timers - Internal store of Phaser.Timer objects.
    * @private
    */
    this._timers = [];


    this.events.start();
};

Phaser.Clock.prototype = {

    /**
    * Creates a new stand-alone Phaser.Timer object. This timer will be updated automatically with the Clock object.
    *
    * If you need more control about when the timer is triggered, create a timer manually using Phaser.Timer constructror, then call Phaser.Timer.update yourself when you want the update to occur.
    *
    * @method Phaser.Clock#create
    * @param {boolean} [autoDestroy=true] - A Timer that is set to automatically destroy itself will do so after all of its events have been dispatched (assuming no looping events).
    * @return {Phaser.Timer} The Timer object that was created.
    */
    create: function (autoDestroy) {

        if (typeof autoDestroy === 'undefined') { autoDestroy = true; }

        var timer = new Phaser.Timer(this.game, autoDestroy, this);

        this._timers.push(timer);

        return timer;

    },

    /**
    * Remove all Timer objects added with create, regardless of their state. Also clears all Timers from the Time.events timer.
    *
    * @method Phaser.Clock#removeAll
    */
    removeAll: function () {

        for (var i = 0; i < this._timers.length; i++)
        {
            this._timers[i].destroy();
        }

        this._timers = [];

        this.events.removeAll();

    },

    /**
    * Move the clock forward by the given amount of time.
    *
    * @method Phaser.Clock#update
    * @protected
    * @param {number} elapsed - The amount of time to add to the clock.
    */
    update: function (elapsed) {

        if (!this.paused) {
            this.now += elapsed * this.timeScale;

            //  Our internal Phaser.Timer
            this.events.update();

            //  Any game level timers
            this._i = 0;
            this._len = this._timers.length;

            while (this._i < this._len)
            {
                if (this._timers[this._i].update())
                {
                    this._i++;
                }
                else
                {
                    this._timers.splice(this._i, 1);

                    this._len--;
                }
            }
        }
    },

    /**
    * How long has passed since the given time.
    *
    * @method Phaser.Clock#elapsedSince
    * @param {number} since - The time you want to measure against (should be in the same reference).
    * @return {number} The difference between the given time and now.
    */
    elapsedSince: function (since) {
        return this.now - since;
    },

    /**
    * Resets the clock so that the current time is 0 and removes all currently running Timers.
    *
    * @method Phaser.Clock#reset
    */
    reset: function () {

        this.now = 0;
        this.removeAll();

    }

};

Phaser.Clock.prototype.constructor = Phaser.Clock;
