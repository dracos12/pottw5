//
// ship class to handle all things... boat!
//

import GameObject from './gameobject';
import { ObjectType } from './gameobject';
import Victor = require('victor');
import CompassRose from './compassrose';
import { TweenLite, Linear, Power2 } from 'gsap';
import Island from './island';
import theSea from './theSea';

export const enum ShipType {
    SLOOP,
    SCHOONER,
    XEBEC,
    BRIG,
    CORVETTE
}

declare var PolyK: any;
//declare var TweenLite: any; // Greensock Tweenlite used outside of typescript

export default class Ship extends GameObject
{
    private heading:Victor; // normalized ship direction
    private degreeHeading:number; // heading expressed as Cartesian degrees
    private targetHeading:number;
    private toLarboard:boolean = false; // which direction to turn to targetHeading
    
    private lastTime:number; // record last timestamp

    private speed:number;       // scalar for speed, expressed as pixels/second
    private targetSpeed:number; // target speed also in pixels per second
    private maxSpeed:number;    // ship characteristic read from data, in pixels/second

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

    private isles:Array<GameObject>;    // reference to theSea island array

    private isAI:boolean = false;       // is this boat running AI?
    private aiTarget:PIXI.Point;        // the x,y coord of where this AI boat is trying to go
    private aiArrived:boolean = false;  // flag used to determine if ai has arrived at its target destination
    private aiStarted:boolean = false;  // flag for first time update
    private aiTargetSprite:PIXI.Sprite;
    private aiBoatPos:PIXI.Sprite;
    private showTarget:boolean = false;
    private aiLastHeading:number = 0;   // time of last call to aiSetHeading
    private aiRayCastArray:Array<PIXI.Sprite> = []; // 32 dots to display potentially 32 ray casts during aiSetHeading
    private aiNextPlot:number = -1;     // init to -1 to signal initialization on first call
    private refPt:PIXI.Point;

    private tweenVars:any;

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
        this.refPt = new PIXI.Point();
        this.tweenVars = { speed: 0 };

        for (var i=0; i<8; i++) {
            this.cartPolyData8.push(new Array<number>());
        }
    }

    // args:
    // p - polygonal data of type any for collisions with PolyK library
    // ai - flag if this boat is ai
    public init(p:any, isles:Array<GameObject>, isAI:boolean=false, pos?:PIXI.Point, aiTarget?:PIXI.Point)
    {
        this.sprite = new PIXI.Sprite(); // an empty sprite
        this.setPolyData(p);
        this.matchHeadingToSprite(); // initialize the texture its using
        this.shipName = "Nutmeg of Consolation"; 
        this.achtung = new PIXI.Sprite(PIXI.Texture.fromFrame("achtung.png"));
        // do not add achtung until needed
        this.aiTargetSprite = new PIXI.Sprite(PIXI.Texture.fromFrame("PointRed.png"));
        this.aiTargetSprite.anchor.x = this.aiTargetSprite.anchor.y = 0.5;

        // create AI ray cast visuals
        for (var i=0; i<32; i++)
            this.aiRayCastArray.push(new PIXI.Sprite(PIXI.Texture.fromFrame("PointRed.png")));

        this.aiBoatPos = new PIXI.Sprite(PIXI.Texture.fromFrame("PointRed.png"));
        this.aiBoatPos.anchor.x = this.aiBoatPos.anchor.y = 0.5;
        
        // set position if given
        if (pos) {
            this.sprite.x = pos.x - this.refPt.x;
            this.sprite.y = pos.y - this.refPt.y;
        }

        this.isles = isles; // set the island array for AI use
        this.isAI = isAI; 
        if (isAI) // set the destination for this AI boat
        {
            if (aiTarget)
                this.aiTarget = new PIXI.Point(aiTarget.x, aiTarget.y);
            else
                this.aiTarget = new PIXI.Point(6200,2600); // water north of guadalupe
        }
    }

    private plotPoint(x:number, y:number)
    {
        this.aiRayCastArray[this.aiNextPlot].x = x;
        this.aiRayCastArray[this.aiNextPlot].y = y;
        this.aiRayCastArray[this.aiNextPlot].visible = true;
        this.aiNextPlot++;
        //console.log("plotPont: " + x.toFixed(0) + "," + y.toFixed(0));
    }

    private resetPlots()
    {
        if (this.aiNextPlot = -1) // first time in reset, add all sprites to parent
        {
            for (var k=0;k<32;k++) {
                this.sprite.parent.addChild(this.aiRayCastArray[k]);
                this.aiRayCastArray[k].anchor.x = this.aiRayCastArray[k].anchor.y = 0.5;
            }
        }
        this.aiNextPlot = 0;
        for (var i=0; i<32; i++)
            this.aiRayCastArray[i].visible = false;
    }

    // returns 1 if baseHeading + offset is good
    // returns -1 if baseHeading - offset is good
    // returns 0 if neither is good
    // returns 2 if both +/- offset are good
    // offset in degrees
    // baseheading is a cartesian angle
    private checkNewHeading(baseHeading:Victor, offset:number)
    {
        // rotate the vector by +offset
        
        var plusVec:Victor = baseHeading.clone(); 
        var minusVec:Victor = baseHeading.clone(); 

        plusVec.rotate(CompassRose.getRads(offset));
        minusVec.rotate(CompassRose.getRads(-offset));

        plusVec.normalize();
        minusVec.normalize();

        //console.log ("checkNewHeading: offset: " + offset + " plusVec: " + plusVec);
        
        var plusGood:boolean = true;
        var minusGood:boolean = true;
        var x,y,dx,dy;
        var plusDeg, minusDeg;
        let iscc = {dist:0, edge:0, norm:{x:0, y:0}, refl:{x:0, y:0}};

        plusDeg = CompassRose.convertCartToCompass(plusVec.horizontalAngleDeg());
        minusDeg = CompassRose.convertCartToCompass(minusVec.horizontalAngleDeg());
        //console.log("Trying headings: " + plusDeg.toFixed(2) + " " + minusDeg.toFixed(2));
        //console.log("Trying headings: " + plusVec.horizontalAngleDeg().toFixed(2) + " " + minusVec.horizontalAngleDeg().toFixed(2));
        var plusResult = "OK";
        var minusResult = "OK";

        // check plus vec first
        if (CompassRose.isValidHeading(this.angleToWind, plusVec.horizontalAngleDeg()))
        {
            // not into the wind, now ray cast against all islands
            x = this.sprite.x + this.refPt.x;
            y = this.sprite.y + this.refPt.y;
            dx = x + plusVec.x * 200;
            dy = y + plusVec.y * 200;
            // before converting to Cartesian, plot a point
            this.plotPoint(dx, dy);
            // convert y and dy to cartesian
            y = 8192 - y;
            dy = 8192 - dy;
            for (let isle of this.isles)
            {
                if (PolyK.ContainsPoint(isle.getCartPolyData(), x, y))
                {
                    console.log("Origin Point is INSIDE " + (<Island>isle).getName() );
                }
                let retObj = PolyK.Raycast(isle.getCartPolyData(), x, y, dx, dy, iscc);
                if (!retObj) {
                    //console.log("missed");
                    iscc.dist = 10000;
                }
                if (iscc.dist < 200)
                {
                    plusGood = false;
                    //console.log("Trying bad heading: " + plusDeg.toFixed(2) + " Raycast hit island!");
                    //plusResult = "Hit " + (<Island>isle).getName() + " at range: " + iscc.dist.toFixed(1) + " edge: " + iscc.edge;
                    plusResult = "x,y: " + x.toFixed(1) + "," + y.toFixed(1) + " dx,dy: " + dx.toFixed(1) + "," + dy.toFixed(1);

                    break; // cancel the loop, we found an isle in our path!
                }
            }
        }
        else {
            //console.log("Trying bad heading: " + plusDeg.toFixed(2) + " into the wind!");
            plusResult = "Wind";
            plusGood = false; // into the wind
        }

        // check minus vec
        if (CompassRose.isValidHeading(this.angleToWind, minusVec.horizontalAngleDeg()))
        {
            // not into the wind, now ray cast against all islands
            x = this.sprite.x + this.refPt.x;
            y = this.sprite.y + this.refPt.y;
            dx = x + minusVec.x * 200;
            dy = y + minusVec.y * 200;
            // before converting to Cartesian, plot a point
            this.plotPoint(dx, dy);
            // convert y and dy to cartesian
            y = 8192 - y;
            dy = 8192 - dy;
            for (let isle of this.isles)
            {
                if (!PolyK.IsSimple(isle.getCartPolyData()))
                    console.log("Polygon not simple: " + (<Island>isle).getName() );
                if (PolyK.ContainsPoint(isle.getCartPolyData(), x, y))
                {
                    console.log("Origin Point is INSIDE " + (<Island>isle).getName() );
                }
                let retObj = PolyK.Raycast(isle.getCartPolyData(), x, y, dx, dy, iscc);
                if (!retObj) {
                    //console.log("missed");
                    iscc.dist = 10000;
                }
                if (iscc.dist < 200)
                {
                    minusGood = false;
                    minusResult = "Hit " + (<Island>isle).getName() + " at range: " + iscc.dist.toFixed(1) + " edge: " + iscc.edge;
                    break; // cancel the loop, we found an isle in our path!
                }
            }
        }
        else{
            minusResult = "Wind";
            minusGood = false; // into the wind
        }

        console.log(plusResult + " " + minusResult);
        // return results
        if (!minusGood && !plusGood)
            return 0; // neither good
        if (minusGood && !plusGood)
            return -1;
        if (!minusGood && plusGood)
            return 1;
            
        return 2; // both are good
    }

    private saveCode()
    {
        /*
        // check our current heading for validity
        if (this.checkNewHeading(directHeading, 0) == 0)
        {
            // find a good heading by looping from our current heading out 180 degrees both lar and starboard
            console.log("aiSetHeading: bad heading: " + CompassRose.convertCartToCompass(newHeadingAng));
            console.log("Searching for good heading...");

            tryOffset = 0;
            var ptCount = 0;

            while (goodHeadingFound == 0)
            {
                tryOffset += 11.25;
                ptCount++;
                if (tryOffset > 180)
                {
                    console.log("aiSetHeading: exhausted all headings! Stuck! Tried Pts: " + (ptCount-1));
                    this.showAchtung();
                    this.allStop();
                    this.aiArrived = true;
                    return; // there is no point in continuing ;)
                }
                goodHeadingFound = this.checkNewHeading(directHeading, tryOffset);
            }

            // if we are here we have found a good heading
            if (goodHeadingFound == 1 || goodHeadingFound == 2) 
            {
                newHeading = directHeading.clone();
                newHeading.rotate(CompassRose.getRads(tryOffset));
                newHeadingAng = newHeading.horizontalAngleDeg();
            } else if (goodHeadingFound == -1)
            {
                newHeading = directHeading.clone();
                newHeading.rotate(CompassRose.getRads(-tryOffset));
                newHeadingAng = newHeading.horizontalAngleDeg();
            }
            else // shouldnt be able to get here
            {
                newHeading = directHeading.clone();
                console.log("shoudnt get here!");
            }

            this.heading.x = newHeading.x;
            this.heading.y = newHeading.y;
            
            console.log("aiSetHeading: Found good heading. Tried compass points: " + ptCount);
        }
        else // heading valid, use it
        {
            this.heading.x = directHeading.x;
            this.heading.y = directHeading.y;       
            newHeadingAng = this.heading.horizontalAngleDeg();
        }
        */
    }

    private checkHeading(newHeading:Victor)
    {

        var newHeadingDeg = newHeading.angleDeg();
        var newHeadingCompassDeg = CompassRose.convertCartToCompass(newHeadingDeg);

        if (!CompassRose.isValidHeading(this.angleToWind, newHeadingDeg))
        {
            //console.log("checkHeading: " + newHeadingCompassDeg.toFixed(2) + " is into the wind.");
            return false; // into the wind
        }

        // not into the wind, so hit check against the islands
        var x,y,dx,dy,px,py;
        let iscc = {dist:0, edge:0, norm:{x:0, y:0}, refl:{x:0, y:0}};
        x = this.sprite.x + this.refPt.x;
        y = this.sprite.y + this.refPt.y;
        px = x;
        py = y;
        y = 8192 - y;
        dx = x + newHeading.x * 200;
        dy = y + newHeading.y * 200;
        px += newHeading.x * 200;
        py += -newHeading.y * 200;
        this.plotPoint(px,py);

        // loop thru the isles... see if we hit
        for (let isle of this.isles)
        {
            //console.log("isle data contains: " + isle.getCartPolyData().length + " entries" ); 
            let retObj = PolyK.Raycast(isle.getCartPolyData(), x, y, newHeading.x, newHeading.y, iscc);
            if (!retObj) iscc.dist = 10000;
            if (iscc.dist < 300) {   
            //if (PolyK.ContainsPoint(isle.getCartPolyData(),dx,dy)) { // we've hit an isle!
                //console.log("Hit " + (<Island>isle).getName() + " along heading: " + newHeadingCompassDeg.toFixed(2) + " at dist: " + iscc.dist.toFixed(2));
                return false;
            }
        }  

        return true;
    }

    private calcNewHeading(original:Victor, offset:number)
    {
        var newVic:Victor = original.clone();
        newVic.rotate(CompassRose.getRads(offset));
        newVic.normalize();
        return newVic;
    }

    private aiSetHeading()
    {
        // find a heading directly at our target destination
        // and that is not heading directly into the wind
        // convert world space to cartesian space coords
        let diffX = this.aiTarget.x - (this.sprite.x + this.refPt.x);
        let diffY = ((8192 - this.aiTarget.y) - (8192 - (this.sprite.y + this.refPt.y))); // y is flipped in cartesian
        let directHeading = new Victor( diffX, diffY );
        directHeading.normalize();

        let newHeadingAng = directHeading.horizontalAngleDeg();
        var goodHeadingFound = 0;
        var tryOffset = 0;

        var newHeading:Victor = directHeading;

        this.resetPlots();

        if (!this.checkHeading(directHeading))
        {
            // sweep in 11.25 degree increments in each direction until good heading found
            while (goodHeadingFound == 0)
            {
                tryOffset += 11.25;
                if (tryOffset > 180)
                {
                    console.log("Cant find good heading");
                    this.showAchtung();
                    this.allStop();
                    return;
                }

                newHeading = this.calcNewHeading(directHeading, tryOffset);
                if (!this.checkHeading(newHeading))
                {
                    newHeading = this.calcNewHeading(directHeading, -tryOffset);
                    if (!this.checkHeading(newHeading))
                        continue;
                    else
                        goodHeadingFound = 1;
                }
                else
                    goodHeadingFound = 1;

            }

            newHeadingAng = newHeading.angleDeg();
        }

        this.changeHeading(newHeadingAng);
        //console.log("aiSetHeading to: " + CompassRose.convertCartToCompass(this.targetHeading).toFixed(2));

        this.matchHeadingToSprite(); 
    }

    public setPolyData(p:any) {
        // p is the ship record from shipdata.json
        this.jsonData = p;
        this.sprite.name = this.jsonData["fileName"];
        this.maxSpeed = this.jsonData["maxHullSpeed"];
    }

    public setIslandArray(islands:Array<GameObject>)
    {
        this.isles = islands;
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
        this.tweenVars.speed = 0;
        TweenLite.killTweensOf(this.tweenVars);
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
        // pick the sprite that is closest to ships heading... 
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
            //console.log("heading:" + a.toFixed(0) + " frameDirection: " + frameNum)
            this.usingFrame = frameNum + modFrame;

            // set pivot point from data
            if (this.jsonData)
            {
                var frameStr = frameName + this.getFrameString(frameNum, 0) + ".png";
                // this.sprite.pivot.x = this.jsonData[frameStr].refPt[0];
                // this.sprite.pivot.y = this.jsonData[frameStr].refPt[1];
                // this.sprite.anchor.x = this.jsonData[frameStr].refPt[0] / this.sprite.width;
                // this.sprite.anchor.y = this.jsonData[frameStr].refPt[1] / this.sprite.height;
                this.refPt.x = this.jsonData[frameStr].refPt[0];
                this.refPt.y = this.jsonData[frameStr].refPt[1];
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
        this.targetSpeed = newTrim * this.maxSpeed; // data driven per boat type
        if (this.targetSpeed <= 0)
        {
            this.targetSpeed = 0;
            this.sailState = 0;
        } else {
            this.sailState = 2; // sails up
        }
        console.log("setting Sail Trim: " + newTrim.toFixed(2) + " TargetSpeed: " + this.targetSpeed.toFixed(2));

        // if (!this.aGround && !this.inIrons)
        //     TweenLite.to(this.tweenVars, 2.5, { speed:this.targetSpeed, ease: Power2.easeInOut });
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
        var deltaTime = 0;        
        var now = Date.now();
        var acc = this.maxSpeed / 2.5; // takes 2.5 seconds to accelerate to max speed
        var accMS = acc / 1000;
        var dampMS = accMS/4; // dampening force is half of acceleration force

        if (this.lastTime != 0) {
            deltaTime = now - this.lastTime;
        
            if (!CompassRose.isValidHeading(this.angleToWind, this.degreeHeading)) 
            {
                var deltaDamp = dampMS * deltaTime;

                this.speed -= deltaDamp; // 0.1;
                
                if (this.speed < 0)
                    this.speed = 0;
                
                //console.log("Speed: " + this.speed.toFixed(2) + " TargetSpeed: " + this.targetSpeed.toFixed(2) + " DeltaDamp: " + deltaDamp.toFixed(2));
            } 
            else if (this.speed != this.targetSpeed)
            {
                var deltaAcc = accMS * deltaTime;

                if (this.speed < this.targetSpeed) {
                    this.speed += deltaAcc; //0.1;
                    if (this.speed >= this.targetSpeed)
                        this.speed = this.targetSpeed;
                } else {
                    this.speed -= deltaAcc; //0.1;
                    if (this.speed < 0)
                        this.speed = 0;
                }
    
                //console.log("Speed: " + this.speed.toFixed(2) + " TargetSpeed: " + this.targetSpeed.toFixed(2));
            }

            var speedMS = this.speed/1000;
            var speedDelta = speedMS * deltaTime;

            this.sprite.x += speedDelta * this.heading.x;
            this.sprite.y += speedDelta * -this.heading.y;            
        }

        if (this.targetHeading.toFixed(0) != this.degreeHeading.toFixed(0)) {
            if (this.lastTime != 0)
            {
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
                this.heading.y = ypart; // y is flipped when applying to sprite in setposition
                this.heading.normalize(); // make sure its normalized

                //console.log("target: " + this.targetHeading.toFixed(0) + " heading: " + this.degreeHeading.toFixed(4) + " dA: " + deltaAngle.toFixed(4) + " dTime: " +  deltaTime);

            }

            
        }

        // update lastTime
        this.lastTime = now; 

        // update its sprite if necessary
        this.matchHeadingToSprite();

        this.updateAchtung();

        // ai boat handling
        if (this.isAI)
        {
            if (!this.aiStarted)
            {
                this.resetPlots(); // init the ai plots
                this.aiStarted = true;
                // set sail! all ahead half!
                this.setSailTrim(0.5);
                this.aiSetHeading();
                this.aiLastHeading = now;
            }

            if (!this.aiArrived)
            {
                if (now - this.aiLastHeading > 7500) // check our heading!
                {
                    this.aiSetHeading();
                    this.aiLastHeading = now;
                }

                // if we are within the radius of our destination, come to a halt
                var vec1 = new Victor(this.sprite.x + this.refPt.x, this.sprite.y + this.refPt.y);
                var vec2 = new Victor(this.aiTarget.x, this.aiTarget.y);
                var dist = Math.abs(vec1.distance(vec2));
                if (dist < 50) {
                    this.showAchtung();
                    this.setSailTrim(0);
                    this.aiArrived = true;
                }
            }

            if (!this.showTarget)
                this.showAITarget();

            this.updateAITarget();
        } else 
        {
            // check if we need to display the error icon
            if (this.aGround || this.inIrons)
            {
                this.showAchtung();
            }
            else  // remove achtung if present
            {
                this.hideAchtung();
            }
        }

    }

    private showAITarget()
    {
        if (!this.showTarget)
        {
            // put the aiTarget on the parent
            this.aiTargetSprite.x = this.aiTarget.x;
            this.aiTargetSprite.y = this.aiTarget.y;
            this.sprite.parent.addChild(this.aiTargetSprite);
            this.showTarget = true;

            this.aiBoatPos.x = this.sprite.x;
            this.aiBoatPos.y = this.sprite.y;
            this.sprite.parent.addChild(this.aiBoatPos);
        }
    }

    private updateAITarget()
    {
        this.aiBoatPos.x = this.sprite.x + this.refPt.x;
        this.aiBoatPos.y = this.sprite.y + this.refPt.y;
    }

    private showAchtung()
    {
        if (!this.errorDisplayed)
        {
            // add it
            this.achtung.x = this.sprite.x + this.sprite.width/2 - this.achtung.width/2;
            this.achtung.y = this.sprite.y - this.sprite.height;
            this.sprite.parent.addChild(this.achtung);
            this.errorDisplayed = true;
            //console.log("adding Achtung");
        }
    }

    private updateAchtung()
    {
        if (this.errorDisplayed)
        {
            this.achtung.x = this.sprite.x + this.sprite.width/2 - this.achtung.width/2;
            this.achtung.y = this.sprite.y - this.sprite.height;       
        }
    }

    private hideAchtung()
    {
        if (this.errorDisplayed) {
            this.sprite.parent.removeChild(this.achtung);
            this.errorDisplayed = false;
            //console.log("removing Achtung");
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

    // newHeading is a cartesian angle
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

        // calculate degrees per second, multiply by 1000 to convert to milliseconds
        let timeToTurn = (Math.abs(deltaDegrees) / this.angularSpeed) * 1000;
        //console.log("Changing heading of " + deltaDegrees.toFixed(2) + " in " + timeToTurn.toFixed(2) + " milliseconds");
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