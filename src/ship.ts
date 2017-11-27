//
// ship class to handle all things... boat!
//

import GameObject from './gameobject';
import { ObjectType } from './gameobject';
import Victor = require('victor');
import CompassRose from './compassrose';
import Island from './island';
import theSea from './theSea';
import FXManager from './fxmanager';
import CannonBall from './cannonball';
import { BallType } from './cannonball';
import EconomyItem from './economyitem';

export const enum ShipType {
    SLOOP,
    SCHOONER,
    XEBEC,
    BRIG,
    CORVETTE
}

declare var PolyK: any;
declare var TweenMax:any;
declare var Linear:any;

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
    private aiCurrentObstacle:GameObject; // an isle this ship is currently avoiding
    private aiAvoidToLarboard:boolean;    // preferred direction around said obstacle
    private aiDirectObstacles:Array<GameObject>; // list of isles directHeading intersects

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
    private fxManager:FXManager;

    // ship stats
    private statHull:number = 12;
    private statHullMax:number = 12;
    private statSails:number = 0;
    private statSailsMax:number = 0;
    private statCrew:number = 0;            // feature idea, assign bits to crew to index into name index... crew can have name and exp/level waster/able/midshipman etc
    private statCrewMax:number = 0;
    private wrecked:boolean = false;
    private smokeID:number = 0;

    private shipsHold:Array<EconomyItem> = [];        // just an array of item ids EconomyIcon carries the data
    private coins:number;                       // number of treasure doubloons
    private shipsHoldCapacity:number = 40;       // in "squares" ex Corvette is 10x4 hold so 40 icons

    private magBall:number;                 // how many ball shoit the ship has left
    private magBallMax:number = 15;         // maximum number of ball shot ship can carry

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
        this.aiDirectObstacles = []; // empty array

        for (var i=0; i<8; i++) {
            this.cartPolyData8.push(new Array<number>());
        }

        this.magBall = this.magBallMax;
    }

    public setFXManager(fxman:FXManager)
    {
        this.fxManager = fxman;
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
        var debug = 0;
        if (debug==0)
            return; // stop displaying debug info TODO: make this switchable with debug switch mayhap

        if (this.aiNextPlot >= 32)
        {
            console.log("out of Plot Points!");
            return;
        }

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

    private calcNewHeading(original:Victor, offset:number)
    {
        var newVic:Victor = original.clone();
        newVic.rotate(CompassRose.getRads(offset));
        newVic.normalize();
        return newVic;
    }

    private getVectorAngleDegs(p1:Victor, p2:Victor)
    {
        // angle in degrees
        var angleDeg = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
        return angleDeg;
    }

    private getVectorAngle(p1:Victor, p2:Victor)
    {
        var angleRadians = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return angleRadians;   
    }

    private getSignedAngle(source:Victor, compare:Victor)
    {
        var a2 = Math.atan2(source.y, source.x);
        var a1 = Math.atan2(compare.y, compare.x);
        var sign = a1 > a2 ? 1 : -1;
        var angle = a1 - a2;
        var K = -sign * Math.PI * 2;  // adjusts for crossing the 2PI threashold
        var angle = (Math.abs(K + angle) < Math.abs(angle))? K + angle : angle;

        // still in radians at this point
        return angle;
    }

    // get new heading around passed in heading that avoids our current obstacle by minAngle degrees at minimum
    private aiGetHeadingAroundThreat(heading:Victor, minAngle:number)
    {
        let newHeading:Victor = new Victor(0,0);
        var goodHeadings:Array<Victor> = [];
        var dropPt = false;

        // cast rays from heading in chosen direction in one degree increments 
        // save all successfull rays into an array
        // use the minAngle-th ray as our heading 
        for(var i=0; i<180; i++){
            newHeading = this.calcNewHeading(heading, i); 
            if (i%6==0) dropPt = true;
            else dropPt = false;
            if (this.checkHeadingVSObstacle(newHeading, dropPt, false) && 
                CompassRose.isValidHeading(this.angleToWind, newHeading.angleDeg())) {
                goodHeadings.push(newHeading);
            }
        }

        if (goodHeadings.length == 0)
        {
            return null;
        } else {
            // return the minAngle-th element
            if (minAngle > goodHeadings.length)
                return goodHeadings[goodHeadings.length-1]; // the last element is the best we can do
            else
                return goodHeadings[minAngle];
        }
    }

    private checkHeadingVSObstacle(heading:Victor, dropPoint:boolean=false, useMinDist:boolean=true)
    {
        var x,y,px,py;
        let iscc = {dist:0, edge:0, norm:{x:0, y:0}, refl:{x:0, y:0}};
        x = this.sprite.x + this.refPt.x;
        y = this.sprite.y + this.refPt.y;
        px = x;
        py = y;
        y = 8192 - y;
        var DIST = 300;

        let retObj = PolyK.Raycast(this.aiCurrentObstacle.getCartPolyData(), x, y, heading.x, heading.y, iscc);
        if (!retObj) iscc.dist = 10000;
        if (useMinDist == true && iscc.dist < DIST) {   
            if (dropPoint == true) {
                px += heading.x * iscc.dist;
                py += -heading.y * iscc.dist;
                this.plotPoint(px,py);
            }

            return false;
        }

        if (useMinDist == false) { // return hit at any distance less than 10000
            if (iscc.dist < 10000)
            {
                if (dropPoint == true) {
                    px += heading.x * iscc.dist;
                    py += -heading.y * iscc.dist;
                    this.plotPoint(px,py);
                }
                return false;
            }
        }

        // no hit
        if (dropPoint == true)
        {
            this.plotPoint(px,py);        
            px += this.heading.x * DIST;
            py += -this.heading.y * DIST;
        }

        return true;        
    }

    private checkCurrentHeading(directDist:number, dropPoint:boolean=false)
    {
        var x,y,px,py;
        let iscc = {dist:0, edge:0, norm:{x:0, y:0}, refl:{x:0, y:0}};
        x = this.sprite.x + this.refPt.x;
        y = this.sprite.y + this.refPt.y;
        px = x;
        py = y;
        y = 8192 - y;
        var DIST = 300;

        // loop thru the isles... see if we hit
        for (let isle of this.isles)
        {
            //console.log("isle data contains: " + isle.getCartPolyData().length + " entries" ); 
            let retObj = PolyK.Raycast(isle.getCartPolyData(), x, y, this.heading.x, this.heading.y, iscc);
            if (!retObj) iscc.dist = 10000;
            if (iscc.dist < DIST && iscc.dist < directDist) { // if our direct route is shorter, not a problem   
                // set this isle as our current threat
                this.aiCurrentObstacle = isle;
                
                if (dropPoint == true) {
                    px += this.heading.x * iscc.dist;
                    py += -this.heading.y * iscc.dist;
                    this.plotPoint(px,py);
                }

                return false;
            }
        }  

        // no hit
        if (dropPoint == true)
        {
            this.plotPoint(px,py);        
            px += this.heading.x * DIST;
            py += -this.heading.y * DIST;
        }

        return true;
    }

    // populate list of isles that intersect our direct heading
    private checkDirectHeading(dropPoint:boolean=false)
    {
        // step 0 - calculate our direct heading to aiTarget
        let diffX = this.aiTarget.x - (this.sprite.x + this.refPt.x);
        let diffY = ((8192 - this.aiTarget.y) - (8192 - (this.sprite.y + this.refPt.y))); // y is flipped in cartesian
        let directHeading = new Victor( diffX, diffY );
        let directDist = directHeading.magnitude();
        directHeading.normalize();

        var x,y,px,py;
        let iscc = {dist:0, edge:0, norm:{x:0, y:0}, refl:{x:0, y:0}};
        x = this.sprite.x + this.refPt.x;
        y = this.sprite.y + this.refPt.y;
        px = x;
        py = y;
        y = 8192 - y;

        // clear our stored array
        delete this.aiDirectObstacles;
        this.aiDirectObstacles = [];

        // loop thru the isles... see if we hit
        for (let isle of this.isles)
        {
            //console.log("isle data contains: " + isle.getCartPolyData().length + " entries" ); 
            let retObj = PolyK.Raycast(isle.getCartPolyData(), x, y, directHeading.x, directHeading.y, iscc);
            if (!retObj) iscc.dist = 10000;
            if (iscc.dist < 10000) {   
                // set this isle as our current threat

                // if distance to our target is less than distance to obstruction, then we have hit an island behind our targt, dont add
                if (iscc.dist < directDist)
                    this.aiDirectObstacles.push(isle);

                if (dropPoint == true) {
                    px += this.heading.x * iscc.dist;
                    py += -this.heading.y * iscc.dist;
                    this.plotPoint(px,py);
                }
            }
        } 
    }

    private aiSetHeading ()
    {
        // step 0 - calculate our direct heading to aiTarget
        let diffX = this.aiTarget.x - (this.sprite.x + this.refPt.x);
        let diffY = ((8192 - this.aiTarget.y) - (8192 - (this.sprite.y + this.refPt.y))); // y is flipped in cartesian
        let directHeading = new Victor( diffX, diffY );
        let directDist = directHeading.magnitude();
        directHeading.normalize();
        var newHeading;
        var newHeadingAng;
        var up:Victor = new Victor(0,1);
        var angleOffDirect = this.getSignedAngle(up, directHeading);

        //console.log("Beging aiSetHeading");

        if (angleOffDirect >= 0)
            this.aiAvoidToLarboard = true;
        else
            this.aiAvoidToLarboard = false;

        this.resetPlots();

        // step 1
        // raycast our current heading
        // if obstacle within minDistance, make this obstacle our current threat
        if (this.checkCurrentHeading(directDist) == false)
        {
            // our direct heading has struck an island, aiCurrentObstacle has been set

            // find heading around this obstacle in given direction around our current heading
            // with a minimum of 5 degrees of clearance
            newHeading = this.aiGetHeadingAroundThreat(directHeading, 10);
            //console.log("Current heading hit obstacle, avoiding!");
        } else {
            //console.log("Current heading fine, trying direct heading...");
            // step 2
            // raycast our direct heading and determine if anything blocks our course
            this.checkDirectHeading();
            if (this.aiDirectObstacles.length == 0)
            {
                // set directHeading
                newHeading = directHeading;
                //console.log("direct heading clear, setting directHeading");
            } else { // we have isles in the obstacle list
                // if yes, see if our aiObstacle is in the list
                var islefound = false;
                for(var i=0; i<this.aiDirectObstacles.length; i++)
                    if (this.aiDirectObstacles[i] == this.aiCurrentObstacle){
                        islefound=true;
                        break;
                    }
                // if no, set directHeading
                if (islefound)
                {
                    //console.log("aiObstacle still between us and target, continue to avoid");
                    // our aiobstacle is still between us and our target, continue to avoid it
                    newHeading = this.aiGetHeadingAroundThreat(directHeading, 10);
                }
                else // it is no longer in our way set direct heading
                {
                    //console.log("aiObstacle cleared, setting directHeading");
                    newHeading = directHeading;
                    this.aiCurrentObstacle = null;
                }
            }
        }

        if (newHeading == null){
            // coudlnt find heading.. put up achtung
            console.log("Could not find good heading, stopping!");
            this.showAchtung();
            this.allStop();
            this.aiArrived = true;
        } else {
            newHeadingAng = newHeading.angleDeg();
            if (!CompassRose.isValidHeading(this.angleToWind, newHeadingAng))
            {
                //console.log("newHeading into Wind! Laying to off wind angle!");
                newHeading = this.getSmallestHeadingOffwind(newHeading);
                newHeadingAng = newHeading.angleDeg();
                this.changeHeading(newHeadingAng);
            }
            else {
                this.changeHeading(newHeadingAng); // changes targetHeading inside function
            }
            //console.log("aiSetHeading to: " + CompassRose.convertCartToCompass(this.targetHeading).toFixed(2));
            this.matchHeadingToSprite(); 
        }
    }

    private getSmallestHeadingOffwind(heading:Victor)
    {
        // heading is into the wind, return the smallest vector laying off the wind
        var rVector = new Victor(0,0);
        var lVector = new Victor(0,0);
        var angle = 90; // ask compass rose for a cartesian wind angle
        var rAngle, lAngle, hAngle;

        // get angle of wind to starboard
        angle = 90 - this.angleToWind - 1;
        rVector.x=Math.cos(CompassRose.getRads(angle));
        rVector.y=Math.sin(CompassRose.getRads(angle));
        rAngle = this.getVectorAngleDegs(rVector,heading);

        // get angle of wind to larboard
        angle = 90 + this.angleToWind + 1;
        lVector.x=Math.cos(CompassRose.getRads(angle));
        lVector.y=Math.sin(CompassRose.getRads(angle));
        lAngle = this.getVectorAngleDegs(lVector,heading);

        hAngle = CompassRose.convertCartToCompass(heading.angleDeg());
        var rA, lA;
        rA = CompassRose.convertCartToCompass(rVector.angleDeg());
        lA = CompassRose.convertCartToCompass(lVector.angleDeg());

        //console.log("smallestAngOffWind: heading: " + hAngle.toFixed(2) + " rAngle: " + rVector.angleDeg().toFixed(2) + " lAngle: " + lA.toFixed(2) + "rDiff: " + rAngle.toFixed(2) + " lDiff: " + lAngle.toFixed(2));
        if (Math.abs(rAngle) < Math.abs(lAngle))
            return rVector;
        else
            return lVector;

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

    // return true if passed point is contained in our polygon
    public hitTestByPoint(x:number, y:number)
    {
        //console.log("ship.hitTestByPoint");
        // convert our polygonal data relative to our position
        this.convertPolyDataToCartesian();
        if (PolyK.ContainsPoint(this.cartPolyData8[this.polyNum], x, y)) {
            console.log("ship HIT by point!");
            return true;
        }
        return false;
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
        //TweenLite.killTweensOf(this.tweenVars);
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

    public getRefPt()
    {
        var p = new Victor(this.refPt.x, this.refPt.y);
        return p;
    }

    private getFrameString(frameNum:number, mod:number)
    {
        let n:number = frameNum;

        if (mod != 0)
            n += mod;

        return Ship.zeroPad(n, 4);
    }

    public static zeroPad (num:number, numZeros:number) {
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
        }

        if (this.wrecked)
        {
            // do decay timer perhaps here? cant stay wrecked forever
            // waiting for player to loot, will fade after x minutes
            // no speed, ai or other adjustments needed.. return
            return;
        }
        
        if (!CompassRose.isValidHeading(this.angleToWind, this.degreeHeading)) 
        {
            var deltaDamp = dampMS * deltaTime;

            this.speed -= deltaDamp; // 0.1;
            
            if (this.speed < 0)
                this.speed = 0;
            
            // if (this.targetHeading != this.degreeHeading)
                // console.log("Heading: " + CompassRose.convertCartToCompass(this.degreeHeading).toFixed(2) + " Speed: " + this.speed.toFixed(2) + " TargetSpeed: " + this.targetSpeed.toFixed(2) + " DeltaDamp: " + deltaDamp.toFixed(2));
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
        

        if (this.targetHeading != this.degreeHeading) {
            var deltaAngle = deltaTime * (this.angularSpeed/1000);
            // move to the target in the direction indicated by toLarboard
            if (this.toLarboard) // move to target by adding to degree angle
            {
                this.degreeHeading += deltaAngle;
                if (this.degreeHeading > 180)
                    this.degreeHeading -= 360;
                if (this.degreeHeading > this.targetHeading)
                    this.degreeHeading = this.targetHeading; // we are done
            }
            else // move to target by subtracting to degree angle
            {
                this.degreeHeading -= deltaAngle;
                if (this.degreeHeading < -180)
                    this.degreeHeading += 360;
                if (this.degreeHeading < this.targetHeading)
                    this.degreeHeading = this.targetHeading; // we are done
            }
            
            var xpart = Math.cos(CompassRose.getRads(this.degreeHeading));
            var ypart = Math.sin(CompassRose.getRads(this.degreeHeading));
            
            this.heading.x = xpart; 
            this.heading.y = ypart; // y is flipped when applying to sprite in setposition
            this.heading.normalize(); // make sure its normalized

            // console.log("target: " + CompassRose.convertCartToCompass(this.targetHeading).toFixed(0) + " heading: " + CompassRose.convertCartToCompass(this.degreeHeading).toFixed(4) + " dA: " + deltaAngle.toFixed(4) + " dTime: " +  deltaTime);
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
                if (now - this.aiLastHeading > 1000) // check our heading!
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

            // if (!this.showTarget)
            //     this.showAITarget();

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
            var numChildren = this.sprite.parent.children.length;
            this.sprite.parent.addChildAt(this.achtung, numChildren-1);
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

    // fire battery and return the milliseconds it will take to reload
    public fireCannons(rightBattery:boolean=true)
    {

        if (this.magBall > 0)
        {
            console.log("FIRE!!");
            this.magBall -= 1; // deduct ammo (for now just one shot)

            // velocity calculations
            var v:Victor = new Victor(0,0);
            v.x = this.heading.x;
            v.y = -this.heading.y;
            
            // get direction
            if (rightBattery)
                v.rotate(CompassRose.getRads(90));
            else
                v.rotate(CompassRose.getRads(-90));

            v.normalize();

            // add speed data - speed expressed as pixels/millisecond
            // var speed = 250 / 1000;
            // v.multiplyScalar(speed);

            // request a cannonball and give it a velocity
            var ball = this.fxManager.getCannonBall();
            var x = this.sprite.x + this.refPt.x;
            var y = this.sprite.y + this.refPt.y;
            ball.fire(x, y, v, 4, BallType.BALL, this);
            this.fxManager.placeMuzzlePlume(x, y, v);

            // return the reload speed based off crew ability
            return 2500;
        }
        else
        {
            console.log("Captain! The magazine has run dry! We should put into port and reload!");
            return 0;
        }
    }

    public getMagBall()
    {
        return this.magBall;
    }

    public getMagBallMax()
    {
        return this.magBallMax;
    }

    public receiveFire(weight:number, source:GameObject)
    {
        this.statHull -= weight;
        if (this.statHull <= 0)
        {
            // we are destroyed
            this.wrecked = true;
            this.targetSpeed = 0;
            this.speed = 0;
            // switch our frame to our wrecked frame
            this.switchFrameToWrecked();
            // ask the fx manager for a smoke plume at our reference point
            this.smokeID = this.fxManager.placeSmokePlume(this.sprite.x + this.refPt.x, this.sprite.y+this.refPt.y);
            // wreck frame does not conform.. move sprite by wreck offset.. for now hardcoded
            this.sprite.y += 30;   
        }    

        console.log("took " + weight + " damage. Hull: " + this.statHull);
    }

    private switchFrameToWrecked()
    {
        let s = this.getSprite();

        s.texture = PIXI.Texture.fromFrame("CorvetteBodyWreck.png");

        s.interactive = true;

        // add listeners to mouse down and up
        s.on("mousedown", this.wreckMouseDown);
        s.on("mouseup", this.wreckMouseUp);

        this.aiPopulateLoot();
    }

    public sink()
    {
        // fade the ship out and then remove us from the map
        let s = this.getSprite();
        s.interactive = false;
        // return the smoke to the fxmanager
        this.fxManager.returnSmokeToPool(this.smokeID);
        TweenMax.to(s, 2, {alpha:0,onComplete:this.sunk})
    }

    private sunk = () =>
    {
        let s = this.getSprite();
        let p =s.parent;
        p.removeChild(s);
    }

    // mouse handlers, just send a message for the hud to handle the loot mechanic
    wreckMouseDown = (e:any) => {
        var myEvent = new CustomEvent("wreckMouseDown",
        {
            'detail': { "boat": this, "holdLength": this.shipsHold.length }
        });

        window.dispatchEvent(myEvent);
    }

    wreckMouseUp = (e:any) => {
        var myEvent = new CustomEvent("wreckMouseUp",
        {
            'detail': { "boat": this, "holdLength": this.shipsHold.length }
        });

        window.dispatchEvent(myEvent);
    }

    public aiPopulateLoot()
    {
        // fill the hold with random loot items
        var i=0;
        var itemID;

        for (i=0; i<5; i++)
        {
            // generate a random loot item 
            itemID = theSea.getRandomIntInclusive(0,EconomyItem.maxItems-1);
            this.shipsHold[i] = new EconomyItem(itemID); // random rarity
        }

        // randomly generate the coin value treasure this boat may have
        this.coins = theSea.getRandomIntInclusive(1,10);
    }

    public getCoins()
    {
        return this.coins;
    }

    // return next itemID from the shipsHold
    public aiPopNextLoot()
    {
        if (this.shipsHold.length == 0)
            return null;

        return this.shipsHold.pop();
    }

    public aiNumHoldItems()
    {
        return this.shipsHold.length;
    }

    public addToHold(itemType:number,rarity?:number)
    {
        if (this.shipsHold.length < this.shipsHoldCapacity)
        {
            var e = new EconomyItem(itemType,rarity)
            this.shipsHold.push(e);
            return true;
        }
        else
        {
            return false;
        }
    }

    public isHoldFull()
    {
        if (this.shipsHold.length < this.shipsHoldCapacity)
            return false;
        else
            return true;    
    }

    public getHold()
    {
        return this.shipsHold;
    }
}