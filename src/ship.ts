//
// ship class to handle all things... boat!
//

import GameObject from './gameobject';
import { ObjectType } from './gameobject';
import Victor = require('victor');

export const enum ShipType {
    SLOOP,
    SCHOONER,
    XEBEC,
    BRIG,
    CORVETTE
}

export default class Ship extends GameObject
{
    private heading:Victor; // normalized ship direction
    private speed:number;   // scalar for speed (why not use a velocity vector to combine heading and speed?)
    private name:string;    // all boats must have a name! ;)
    private sailState:number; // 0 = down, 1 = full sail, 2 = half sail

    private shipType:ShipType;

    private usingFrame:number; // frame number in use, cached to prevent texture swap spam

    constructor()
    {
        super();
        this.objType = ObjectType.SHIP;
        this.shipType = ShipType.CORVETTE; 
        this.sailState = 0; // down
        this.speed = 0;
        this.heading = new Victor(1,0); // east
    }

    public init()
    {
        this.sprite = new PIXI.Sprite(); // an empty sprite
        this.matchHeadingToSprite(); // initialize the texture its using
    }

    public setPosition(x:number, y: number) 
    {
        this.sprite.x = x;
        this.sprite.y = y;
    }

    private matchHeadingToSprite() {
        // pick the spirte that is closest to ships heading... 
        // we have 8 directional sprites
        let a = this.heading.angleDeg();
        let s = this.getSprite();
        let modFrame = 0;
        let frameName = "";

        if (this.sailState == 0) // if sails down, offset frame num by 8  ie 0003 will become 00011
            modFrame = 8;
        
        if (this.shipType == ShipType.CORVETTE)
            frameName = "Corvette";
        else    
            frameName = "Corvette"; // add other ship sprites here as they are added

        let frameNum = 0;

        if (a <= 22.5 && a > -22.5 ) // the right facing image
            frameNum = 3;
        else if (a <= 67.5 && a > 22.5) // the up and right image
            frameNum = 2;
        else if (a <= 112.5 && a > 67.5) // the up facing image
            frameNum = 1;
        else if (a <= 157.5 && a > 112.5) // the up and right image
            frameNum = 8;
        else if (a <= -157.5 || a > 157.5) // the left facing image
            frameNum = 7;
        else if (a <= -112.5 && a > -157.5) // the left and down image
            frameNum = 6;
        else if (a <= -67.5 && a > -112.5) // the down image
            frameNum = 5;
        else if (a <= -22.5 && a > -67.5) // the down and right image
            frameNum = 4;
        else    
            console.log("Ship class has invalid angle, texture could not be set");

        if (this.usingFrame != frameNum + modFrame) {
            // replace our texture with the appropriate facing
            s.texture = PIXI.Texture.fromFrame(frameName + this.getFrameString(frameNum, modFrame) + ".png");
            console.log("replacing texture with frame: " + frameNum);
        }
    }

    private getFrameString(frameNum:number, mod:number)
    {
        let n:number = frameNum;

        if (mod != 0)
            n += mod;

        return this.zeroPad(n, 4);
    }

    private zeroPad (num:number, numZeros:number) {
        var an = Math.abs (num);
        var digitCount = 1 + Math.floor (Math.log (an) / Math.LN10);
        if (digitCount >= numZeros) {
            return num.toString();
        }
        var zeroString = Math.pow (10, numZeros - digitCount).toString ().substr (1);
        return num < 0 ? '-' + zeroString + an : zeroString + an;
    }

    public update() {
        // update the sprite position by the speed + heading
        
        // update its sprite if necessary
        this.matchHeadingToSprite();

    }
}