//
// CannonBall class
// self contained entity to manage the cannon ball and its flight, damage, results etc
//

import * as PIXI from 'pixi.js';
import Victor = require('victor');

export const enum BallType {
    CANNISTER,
    BAR,
    BALL
}

export default class CannonBall extends PIXI.Sprite
{

    public v:Victor;           // velocity (speed plus heading) of this cannonball in pixels/millisecond
    private pos:Victor;
    public origin:Victor;  // world coord of cannonball's origin pt
    public maxDist:number;     // how far (in pixels) can it fly?
    public weight:number;      // 4lbs ball etc... ships will use this info to apply damage
    public type:BallType;      // cannister, bar, ball
    public inUse:boolean = false; // if not inuse, fxmanager can recycle
    public spent:boolean = false; // has this ball flown over its maxDist value
    private lastTime:number = 0; // frame calculation data

    constructor()
    {
        super();
        this.texture = PIXI.Texture.fromFrame("theBall.png");
        this.v = new Victor(0,0);
        this.pos = new Victor(0,0);
        this.origin = new Victor(0,0);
    }

    // allow override for maxdist, this is set by type normally
    // vector givin in pixels/millisecond
    public fire(ox:number, oy:number, velocity:Victor, weight:number, type:BallType, maxDist?:number)
    {
        this.origin.x = ox;
        this.origin.y = oy;
        this.x = ox;
        this.y = oy;
        this.v.x = velocity.x;
        this.v.y = velocity.y;
        this.weight = weight;
        this.type = type;
        if(maxDist)
            this.maxDist = maxDist;
        else
            this.maxDist = 350;
    }

    public update()
    {
        var deltaTime = 0;        
        var now = Date.now();

        if (this.lastTime != 0) {
            deltaTime = now - this.lastTime;
        }

        this.lastTime = now;

        var speed = 250 / 1000;

        this.x += this.v.x * speed * deltaTime;
        this.y += this.v.y * speed * deltaTime;
        this.pos.x = this.x;
        this.pos.y = this.y;

        // if we have travelled our maxDist set the spent signal
        var dist = this.pos.distance(this.origin);
        //console.log("ball dist: " + dist + " pos: " + this.pos.x + "," + this.pos.y);
        if (dist > this.maxDist)
            this.spent = true;
    }
}