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

    private v:Victor;           // velocity (speed plus heading) of this cannonball
    private origin:PIXI.Point;  // world coord of cannonball's origin pt
    private maxDist:number;     // how far (in pixels) can it fly?
    private weight:number;      // 4lbs ball etc... ships will use this info to apply damage
    private type:BallType;      // cannister, bar, ball
    public inUse:boolean = false; // if not inuse, fxmanager can recycle

    constructor()
    {
        super();
    }

    public fire(ox:number, oy:number, heading:Victor, weight:number, type:BallType, maxDist:number)
    {

    }

    public update()
    {

    }
}