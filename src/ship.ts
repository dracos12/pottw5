//
// ship class to handle all things... boat!
//

import GameObject from './gameobject';
import { ObjectType } from './gameobject';
import Victor = require('victor');
import CompassRose from './compassrose';

export const enum ShipType {
    SLOOP,
    SCHOONER,
    XEBEC,
    BRIG,
    CORVETTE
}

declare var PolyK: any;

export default class Ship extends GameObject
{
    private heading:Victor; // normalized ship direction
    private degreeHeading:number; // heading expressed as degrees
    private targetHeading:number;
    private toLarboard:boolean = false; // which direction to turn to targetHeading
    
    private lastTime:number; // record last timestamp

    private speed:number;   // scalar for speed (why not use a velocity vector to combine heading and speed?)
    private targetSpeed:number;

    private shipName:string;    // all boats must have a name! ;)
    private sailState:number; // 0 = down, 1 = full sail, 2 = half sail
    private polyNum:number= 0; // current heading corresponds to which index in the polyData array?

    private shipType:ShipType;

    private usingFrame:number; // frame number in use, cached to prevent texture swap spam
    private cartPolyData8:Array<Array<number>> = []; // an array of 8 arrays converted to cartesian
    private cartKeelData:Array<number> = [];
    private jsonData:any;      // object handed to us from the json loader

    // boat handling characteristics
    private angularSpeed:number = 30;   // turn rate in degrees/second
    private angleToWind:number = 60;    // closet angle to the wind this ship can sail upon

    private aGround:boolean = false;    // are we aground? set by theSea main loop
    private inIrons:boolean = false;    // are we inIrons? set by compassRose

    private achtung:PIXI.Sprite;        // exclaimation sprite indicating error condition
    private errorDisplayed:boolean = false;  // is achtung up?

    constructor()
    {
        super();
        this.objType = ObjectType.SHIP;
        this.shipType = ShipType.CORVETTE; 
        this.sailState = 0; // down
        this.speed = 0;
        this.targetSpeed = 0;
        this.heading = new Victor(1,0); // east
        this.degreeHeading = this.heading.angleDeg(); 
        this.targetHeading = this.degreeHeading;
        this.lastTime = 0;

        for (var i=0; i<8; i++) {
            this.cartPolyData8.push(new Array<number>());
        }
    }

    public init(p:any)
    {
        this.sprite = new PIXI.Sprite(); // an empty sprite
        this.setPolyData(p);
        this.matchHeadingToSprite(); // initialize the texture its using
        this.shipName = "Nutmeg of Consolation"; 
        this.achtung = new PIXI.Sprite(PIXI.Texture.fromFrame("achtung.png"));
        // do not add achtung until needed 
    }

    public setPolyData(p:any) {
        // p is the ship record from shipdata.json
        this.jsonData = p;
        this.sprite.name = this.jsonData["fileName"];
    }

    // ships move so they must convert their polyData each time it is referenced
    protected convertPolyDataToCartesian()
    {
        if (!this.jsonData)
            return;
        let root = this.jsonData["fileName"]; // root filename for subsequent polyData keys
        // extract the 8-way polydata arrays in each subobject in this data
        var key = root + "000" + (this.polyNum + 1) + ".png"; // polynum is zero based, frames are 1 based
        if (this.jsonData.hasOwnProperty(key)) {
            for (var k=0; k<this.jsonData[key].polygonPts.length; k++)
            {
                if (k%2 == 0) // each even index is an "x" coordinate
                {
                    // x axis is same direction as cartesian
                    this.cartPolyData8[this.polyNum][k] = this.jsonData[key].polygonPts[k] + this.sprite.x; // world coord x
                }
                else // each odd index is a "y" coordinate
                {
                    // bottom left of our "world" is 0,8192
                    var cartSpriteY = 8192 - this.sprite.y; 
                    this.cartPolyData8[this.polyNum][k] = cartSpriteY - this.jsonData[key].polygonPts[k];
                }   
            }

            this.cartKeelData = []; // clear the array
            for (k=0; k<this.jsonData[key].keelPts.length; k++)
            {
                if (k%2 == 0) // each even index is an "x" coordinate
                {
                    // x axis is same direction as cartesian
                    this.cartKeelData[k] = this.jsonData[key].keelPts[k] + this.sprite.x; // world coord x
                }
                else // each odd index is a "y" coordinate
                {
                    // bottom left of our "world" is 0,8192
                    var cartSpriteY = 8192 - this.sprite.y; 
                    this.cartKeelData[k] = cartSpriteY - this.jsonData[key].keelPts[k];
                }                 
            }
        } else {
            console.log("Failed to find key: " + key + " in ship data!");
        }
    }

    public cartesianHitTest = (p:PIXI.Point) => {
        //console.log(this.polyData);
        if (this.cartPolyData8[this.polyNum]) {
            // calculate the polygonal data for the ships position and its current sprite/heading
            this.convertPolyDataToCartesian();
            // point assumed to be in cartesian coords... compare this to our polyData via PolyK library
            return PolyK.ContainsPoint(this.cartPolyData8[this.polyNum], p.x, p.y);
        } else {
            console.log("polyData not yet defined");
        }
    }

    public hitTestByPolygon(polygonPts:any)
    {
        // convert our polygonal data relative to our position
        this.convertPolyDataToCartesian();

        var x, y;

        // console.log("Island polygon: " + polygonPts);
        // console.log("Boat Pts: " + this.cartPolyData8[this.polyNum]);

        for(var i=0; i<this.cartPolyData8[this.polyNum].length; i+=2)
        {
            x = this.cartPolyData8[this.polyNum][i];
            y = this.cartPolyData8[this.polyNum][i+1];
            // for each point in our polygon, do a polyK hittest on the passed in polygon
            if (PolyK.ContainsPoint(polygonPts, x, y)) {
                console.log("hit!");
                return true;
            }
        }

        return false;
    }

    public hitTestByKeel(polygonPts:any)
    {
        // convert our polygonal data relative to our position
        this.convertPolyDataToCartesian();

        var x, y;

        // console.log("Island polygon: " + polygonPts);
        // console.log("Boat Pts: " + this.cartPolyData8[this.polyNum]);

        for(var i=0; i<this.cartKeelData.length; i+=2)
        {
            x = this.cartKeelData[i];
            y = this.cartKeelData[i+1];
            // for each point in our polygon, do a polyK hittest on the passed in polygon
            if (PolyK.ContainsPoint(polygonPts, x, y)) {
                console.log("hit!");
                return true;
            }
        }

        return false;
    }

    public allStop() {
        this.sailState = 0; // lower the sails!
        this.speed = 0;
        this.targetSpeed = 0;
    }

    public isAground()
    {
        return this.aGround;
    }
    public setAground(aground:boolean)
    {
        this.aGround = aground;
    }

    public setInIrons(inIrons:boolean)
    {
        this.inIrons = inIrons;
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
            frameName = "Corvette2";
        else    
            frameName = "Corvette2"; // add other ship sprites here as they are added

        let frameNum = 0;

        if (a <= 22.5 && a > -22.5 ) { // the right facing image
            frameNum = 3;
            this.polyNum = frameNum - 1; // polynum 0 based, used later as index into polygonData8
        } else if (a <= 67.5 && a > 22.5) { // the up and right image
            frameNum = 2;
            this.polyNum = frameNum - 1;
        } else if (a <= 112.5 && a > 67.5) { // the up facing image
            frameNum = 1;
            this.polyNum = frameNum - 1;
        } else if (a <= 157.5 && a > 112.5) { // the up and right image
            frameNum = 8;
            this.polyNum = frameNum - 1;
        } else if (a <= -157.5 || a > 157.5) {  // the left facing image
            frameNum = 7;
            this.polyNum = frameNum - 1;
        } else if (a <= -112.5 && a > -157.5) {  // the left and down image
            frameNum = 6;
            this.polyNum = frameNum - 1;
        } else if (a <= -67.5 && a > -112.5) {  // the down image
            frameNum = 5;
            this.polyNum = frameNum - 1;
        } else if (a <= -22.5 && a > -67.5) { // the down and right image
            frameNum = 4;
            this.polyNum = frameNum - 1;
        } else    
            console.log("Ship class has invalid angle, texture could not be set");

        if (this.usingFrame != frameNum + modFrame) {
            // replace our texture with the appropriate facing
            s.texture = PIXI.Texture.fromFrame(frameName + this.getFrameString(frameNum, modFrame) + ".png");
            //console.log("replacing texture with frame: " + (frameNum + modFrame));
            console.log("heading:" + a.toFixed(0) + " frameDirection: " + frameNum)
            this.usingFrame = frameNum + modFrame;

            // set pivot point from data
            if (this.polyData)
            {
                var frameStr = frameName + this.getFrameString(frameNum, 0) + ".png";
                this.sprite.pivot.x = this.polyData[frameStr].refPt[0];
                this.sprite.pivot.y = this.polyData[frameStr].refPt[1];
            }
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

    public increaseSail = () =>  {
        this.sailState = 2; // no support for half sail as yet
        this.targetSpeed = 1; // ramp up to 60 pixels/sec speed is in pixels per frame
        console.log("increasing sail Captain!");
    }

    public decreaseSail = () => {
        this.sailState = 0; // straight to no sails
        this.targetSpeed = 0; // ramp down to no velocity
        console.log("Aye! Decreasing sail!");
    }

    public setSailTrim(newTrim:number) {
        // set our speed based off the sail trim... sail trim is 0->1
        this.targetSpeed = newTrim * 1; // 1 is our max speed... max speed can be data driven per boat type
        if (this.targetSpeed <= 0)
        {
            this.targetSpeed = 0;
            this.sailState = 0;
        } else {
            this.sailState = 2; // sails up
        }
        console.log("setting Sail Trim: " + newTrim.toFixed(2));
        
    }

    public wheelStarboard() {
        this.heading.rotateDeg(-15);
        this.heading.normalize();
        this.degreeHeading = this.heading.angleDeg();
        console.log("Aye Starboard wheel! Heading to: " + this.degreeHeading.toFixed(0));
    }

    // Victor lib is broken... rotate does what rotateby docs say, rotateby is broken
    public wheelLarboard() {
        this.heading.rotateDeg(15);
        this.heading.normalize();
        this.degreeHeading = this.heading.angleDeg();

        console.log("Wheel a'Larboard Captain! Heading to: " + this.degreeHeading.toFixed(0) + " angDeg: " + this.heading.angleDeg().toFixed(0));
    }

    private updatePosition() {
        // modify x and y based off heading and speed
        this.sprite.x += this.speed * this.heading.x;
        this.sprite.y += this.speed * -this.heading.y; // y is inverted... heading in cartesean, but our position coords origin is top,left
    }

    update() {
        // update the sprite position by the speed + heading
        if (this.targetSpeed != this.speed)
        {
            if (this.targetSpeed > this.speed) {
                this.speed += 0.01;
                if (this.speed > this.targetSpeed)
                    this.speed = this.targetSpeed
            }
            else {
                this.speed -= 0.01;
                if (this.speed < this.targetSpeed)
                    this.speed = this.targetSpeed;
            }
        }

        if (this.targetHeading.toFixed(0) != this.degreeHeading.toFixed(0)) {
            var now = Date.now();
            var deltaTime;
            if (this.lastTime != 0)
            {
                deltaTime = now - this.lastTime;
                var deltaAngle = deltaTime * (this.angularSpeed/1000);
                // move to the target in the direction indicated by toLarboard
                if (this.toLarboard) // move to target by adding to degree angle
                {
                    this.degreeHeading += deltaAngle;
                    if (this.degreeHeading > 180)
                        this.degreeHeading -= 360;
                }
                else // move to target by subtracting to degree angle
                {
                    this.degreeHeading -= deltaAngle;
                    if (this.degreeHeading < -180)
                        this.degreeHeading += 360;
                }
                
                var xpart = Math.cos(CompassRose.getRads(this.degreeHeading));
                var ypart = Math.sin(CompassRose.getRads(this.degreeHeading));
                
                this.heading.x = xpart; 
                this.heading.y = ypart; // y is flipped in worldspace compared to cartesian values
                this.heading.normalize(); // make sure its normalized

                //console.log("target: " + this.targetHeading.toFixed(0) + " heading: " + this.degreeHeading.toFixed(4) + " dA: " + deltaAngle.toFixed(4) + " dTime: " +  deltaTime);

            }

            this.lastTime = now; 
        }

        this.updatePosition();

        // update its sprite if necessary
        this.matchHeadingToSprite();

        // check if we need to display the error icon
        if (this.aGround || this.inIrons)
        {
            if (!this.errorDisplayed)
            {
                // add it
                this.achtung.x = this.sprite.x + this.sprite.width/2 - this.achtung.width/2;
                this.achtung.y = this.sprite.y - this.sprite.height;
                this.sprite.parent.addChild(this.achtung);
                this.errorDisplayed = true;
                console.log("adding Achtung");
            }
        }
        else  // remove achtung if present
        {
            if (this.errorDisplayed){
                this.sprite.parent.removeChild(this.achtung);
                this.errorDisplayed = false;
                console.log("removing Achtung");
            }
        }

    }

    public getHeading()
    {
        return this.degreeHeading;
    }

    public getAngleToWind()
    {
        return this.angleToWind;
    }

    public changeHeading(newHeading:number)
    {
        // change our heading to the newHeading
        // we accomplish this over time dictated by the skill of our crew
        // for now use the scale 3000->10000 for good->bad crew skill levels

        // small heading changes take less time than large ones
        // tacking through the wind adds a time penalty as the force decays then rises
        let deltaDegrees = this.larOrStarboard(newHeading);
        this.targetHeading = newHeading;
        if (deltaDegrees < 0)
            this.toLarboard = false;
        else    
            this.toLarboard = true;
        
        // reset lastTime
        this.lastTime = 0;

        // caluclate degrees per second, multiply by 1000 to convert to milliseconds
        let timeToTurn = (Math.abs(deltaDegrees) / this.angularSpeed) * 1000;
        console.log("Changing heading of " + deltaDegrees.toFixed(2) + " in " + timeToTurn.toFixed(2) + " milliseconds");
        return timeToTurn;
    }

    // returns -degrees for starboard (subtract from heading until there)
    // return +degrees for larboard (add to heading until there)
    private larOrStarboard(newHeading:number)
    {
        // convert to 360 paradigm (0 being along the positive x axis, sweeping anticlockwise)
        var to;
        var from;

        var left;
        var right;

        if (this.degreeHeading < 0)
            from = this.degreeHeading + 360;
        else   
            from = this.degreeHeading;

        if (newHeading < 0)
            to = newHeading + 360;
        else
            to = newHeading;

        if (from < to)
        {
            left = to - from;
            right = (360 - to) + from;
        }
        else 
        {
            left = (360 - from) + to;
            right = from - to;
            
            //left = to - from;
            //right = (360 - to) + from;
        }

        if (right < left)
            return -right; // go right, right also contains the degrees needed 
        else
            return left; // go left, left contains the degrees needed

    }
}