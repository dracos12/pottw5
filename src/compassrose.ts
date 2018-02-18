//
// CompassRose class widget 
//  displays ship heading, cannon angle, and wind direction
//  ship heading is interactive and allows the player to change the heading
//  allows the player to adjust the cannon angle as well
//

import * as PIXI from 'pixi.js';
import Ship from './ship';
import Watch from './watch';
import Victor = require('victor');

export default class CompassRose extends PIXI.Container
{
    private compassBase:PIXI.Sprite; // base with 32 headings
    private starCap:PIXI.Sprite;     // star cap to hide the bases of the layered needles beneath it
    private needleHeading:PIXI.Sprite; // ship heading needle
    private needleGhostHeading:PIXI.Sprite; // ghost needle for user to move to proposed new heading
    private needleCannon:PIXI.Sprite; // cannon needle
    private windIndicator:PIXI.Sprite;  // wind direction indicator
    private static windDirection:number = 0;       // direction wind is coming from (in degrees - 0 is due North)
    private noGoArc:PIXI.Graphics;      // arc around wind direction for where boats cannot sail to
    private lastWindChange:number;      // time stamp of last windchange
    private periodWindChange:number;    // change the wind every priod (in milliseconds)
    private trackingShip:Ship;
    private animRot:number = 0;
    private mouseDown:boolean = false;
    private trackedNewHeading:number = 0;

    public static getWindDirection()
    {
        return CompassRose.windDirection;
    }

    // init assumes it has its sprite assets available
    public init()
    {
        this.compassBase = new PIXI.Sprite(PIXI.Texture.fromFrame("compassBase.png"));
        this.starCap = new PIXI.Sprite(PIXI.Texture.fromFrame("starRotate.png"));
        this.starCap.x = (this.compassBase.width - this.starCap.width) / 2;
        this.starCap.y = (this.compassBase.height - this.starCap.height) / 2; // centered
        
        this.needleHeading = new PIXI.Sprite(PIXI.Texture.fromFrame("needleShip.png"));
        // this.needleHeading.pivot.x = this.needleHeading.width / 2;
        // this.needleHeading.pivot.y = this.needleHeading.height;  // bottom center of sprite
        this.needleHeading.anchor.x = 0.5;
        this.needleHeading.anchor.y = 1;   // anchor at center bottom
        this.needleHeading.x = 66;
        this.needleHeading.y = 66;
        this.needleHeading.rotation = CompassRose.getRads(15);

        // the ghost heading needle
        this.needleGhostHeading = new PIXI.Sprite(PIXI.Texture.fromFrame("needleShip.png"));
        this.needleGhostHeading.anchor.x = 0.5;
        this.needleGhostHeading.anchor.y = 1;   // anchor at center bottom
        this.needleGhostHeading.x = 66;
        this.needleGhostHeading.y = 66;
        this.needleGhostHeading.rotation = CompassRose.getRads(15);
        this.needleGhostHeading.visible = false;
        this.needleGhostHeading.alpha = 0.67;

        this.needleCannon = new PIXI.Sprite(PIXI.Texture.fromFrame("needleCannon.png"));
        // this.needleCannon.pivot.x = this.needleCannon.width / 2;
        // this.needleCannon.pivot.y = this.needleCannon.height;  // bottom center of sprite
        this.needleCannon.anchor.x = 0.5;
        this.needleCannon.anchor.y = 1;   // anchor at center bottom
        this.needleCannon.x = 66;
        this.needleCannon.y = 66; // centered on compass base
        this.needleCannon.rotation = CompassRose.getRads(105);

        this.windIndicator = new PIXI.Sprite(PIXI.Texture.fromFrame("WindIndicator.png"));
        // this.windDirection.pivot.x = 29;
        // this.windDirection.pivot.y = 183;  // will rotate around this point against the compass base background
        this.windIndicator.anchor.x = 0.5;
        this.windIndicator.anchor.y = 2.5;
        this.windIndicator.x = 66; //this.compassBase.width / 2 - this.windDirection.width / 2;
        this.windIndicator.y = 66; //17; // magic number

        CompassRose.windDirection = 0; // due north



        this.addChild(this.compassBase);    // z order will be in child order, back to front
        this.setNoGo(60);
        this.addChild(this.windIndicator);
        this.addChild(this.needleHeading);
        this.addChild(this.needleGhostHeading);
        this.addChild(this.needleCannon);
        this.addChild(this.starCap);

        this.needleHeading.interactive = true;
        this.needleHeading.on("mousedown", this.mouseDownHandler);

        this.needleHeading.on("mousemove", this.mouseMoveHandler);
        this.needleHeading.on("mouseup", this.mouseUpHandler);

        this.pivot.x = this.compassBase.x  + this.compassBase.width/2;
        this.pivot.y = this.compassBase.y  + this.compassBase.height/2;

    }

    private endSetHeading() {
        if (this.mouseDown == true) {
            this.mouseDown = false;

            //console.log("CompassRose: END ghost heading");
            var myEvent = new CustomEvent("changeHeading",
            {
                'detail': this.trackedNewHeading
            });
    
            window.dispatchEvent(myEvent);

        }
        // else ignore - might be called as mouse moves without mousedown
    }

    private testIsValidHeading()
    {
        var cartAng;
        var i, pos, neg;
        // test against wind at 0 degrees and a boat with 60 degree offwind value
        for (i=0; i<=180; i++)
        {
            pos = CompassRose.isValidHeading(60, i);
            neg = CompassRose.isValidHeading(60,-i);
            console.log("+/- " + i + " : pos=" + pos + " neg=" + neg);
        }
    }

    public static getSmallestHeadingOffwind(angleToWind:number, heading:Victor, returnMax:boolean=false)
    {
        var maxWind = CompassRose.windDirection + angleToWind;
        var minWind = CompassRose.windDirection - angleToWind; 

        // one has crossed the zero degree threshold, convert and do some shenanigans
        if (minWind < 0)
            minWind = 360 + minWind; // ie -15 would become 345

        if (maxWind > 360)
            maxWind = maxWind - 360; // ie 375 would become 15

        if (minWind > maxWind)
        {
            var temp = maxWind;
            maxWind = minWind;
            minWind = temp;
        }

        // convert each to cartesian and compare to heading
        minWind = CompassRose.getRads(CompassRose.convertCompassToCart(minWind));
        maxWind = CompassRose.getRads(CompassRose.convertCompassToCart(maxWind));
        //console.log("cart angles - minWind: " + minWind.toFixed(4) + " maxWind: " + maxWind.toFixed(4));

        var minVic = new Victor(Math.cos(minWind), Math.sin(minWind)); 
        var maxVic = new Victor(Math.cos(maxWind), Math.sin(maxWind));
        heading.norm();
        minVic.norm();
        maxVic.norm();

        var minAngle = Math.acos(heading.dot(minVic));
        var maxAngle = Math.acos(heading.dot(maxVic));

        var minAngleDegs = CompassRose.getDegs(minAngle);
        var maxAngleDegs = CompassRose.getDegs(maxAngle);
        var headingDegs = heading.angleDeg();

        //console.log("headingDegs: " + headingDegs.toFixed(1) + " minAngle: " + minAngleDegs.toFixed(1) + " maxAngle: " + maxAngleDegs.toFixed(1));
        
        if (returnMax)
        {
            if (minAngle > maxAngle)
                return minVic;
            else
                return maxVic;
        } else {
            if (minAngle < maxAngle)
                return minVic;
            else
                return maxVic;
        }
    }

    public static convertCompassToCart(compass:number)
    {
        var mangle = compass + 90; // rotate 90 degrees to align with cartesian zero

        if (compass >=0 && compass <= 90)
            mangle = 90 - compass;
        if (compass > 90 && compass <= 270)
            mangle = -(compass - 90);
        if (compass > 270 && compass <=360)
            mangle = 180 - (compass - 270);
        return mangle;
    }

    //
    // angleToWind: in degrees - specifies angle off the wind a ship can point at minimum
    // trackedHeading: in degrees (Cartesian) to check for validity
    // 
    public static isValidHeading(angleToWind:number, trackedHeading:number, debug:boolean=false)
    {
        // heading is valid if it is not within angleToWind degrees of the current wind direction
        var maxWind = CompassRose.windDirection + angleToWind;
        var minWind = CompassRose.windDirection - angleToWind;
        var tracked = CompassRose.convertCartToCompass(trackedHeading);
        
        // valid angles are 0 -> 360
        if (maxWind > 0 &&  maxWind < 360 && minWind > 0 && minWind < 360)
        {
            if (debug)
                console.log("minWind: " + minWind + " maxWind: " + maxWind + " tracked: " + trackedHeading.toFixed(2) + " trackedDeg: " + tracked.toFixed(2));
            if (tracked >= minWind && tracked <= maxWind)
                return true;
            else
                return false;
        }
        else
        {
            // one has crossed the zero degree threshold, convert and do some shenanigans
            if (minWind < 0)
                minWind = 360 + minWind; // ie -15 would become 345
            if (maxWind > 360)
                maxWind = maxWind - 360; // ie 375 would become 15

            if (minWind > maxWind)
            {
                var temp = maxWind;
                maxWind = minWind;
                minWind = temp;
            }

            if (debug)
                console.log("minWind: " + minWind + " maxWind: " + maxWind + " tracked: " + trackedHeading.toFixed(2) + " trackedDeg: " + tracked.toFixed(2));

            if (tracked >= minWind && tracked <= maxWind)
                return true;
            else
                return false;  
        }
    }

    mouseMoveHandler = (e:any) => {
        
        if (e.data.buttons == 0)
            this.endSetHeading();

        // mouse has moved, find the angle relative to the center of the compass and rotate the ghost image there
        if (this.mouseDown) {
            this.needleGhostHeading.visible = true;
            this.noGoArc.visible = true;
            // get local coords from mouse coords
            let locPt = this.toLocal(new PIXI.Point(e.data.global.x,e.data.global.y));
            // get a vector from these coords
            let vic = new Victor(locPt.x - this.compassBase.width/2, -(locPt.y - this.compassBase.height/2));
            let angDeg = vic.angleDeg();
            this.needleGhostHeading.rotation = CompassRose.getRads(CompassRose.convertCartToCompass(angDeg));
            //console.log("Mouse Degrees: " + vic.angleDeg());
            this.trackedNewHeading = angDeg;
            if (CompassRose.isValidHeading(this.trackingShip.getAngleToWind(), this.trackedNewHeading))
                this.noGoArc.visible = false;
            else
                this.noGoArc.visible = true;
        }

    }

    mouseDownHandler = (e:any) => {
        if (e.target == this.needleHeading)
        {
            this.mouseDown = true;
            //console.log("CompassRose: START ghost heading");
        }
        
    }

    mouseUpHandler = (e:any) => {
        // release mouse no matter what the e.target was
        this.endSetHeading();
    }

    // creates the nogo arc
    // degrees is closest point to wind (total arc will be degrees*2)
    private setNoGo(degrees:number)
    {
        // make a circular arc based off percentDone  100 will be no mask.. reveals clockwise as percent increases
        let degs = degrees * 2;
        let rads = CompassRose.getRads(degs);

        if (this.noGoArc)
        {
            this.removeChild(this.noGoArc);
            this.noGoArc.destroy();
        }

        var arc = new PIXI.Graphics();
        arc.beginFill(0xff0000);
        arc.moveTo(this.compassBase.width/2, this.compassBase.height/2);
        arc.arc(this.compassBase.width/2, this.compassBase.height/2, this.compassBase.width/2, 0, rads, false); // cx, cy, radius, angle, endAngle, anticlockwise bool
        arc.endFill();
        arc.pivot.x = this.compassBase.width/2;
        arc.pivot.y = this.compassBase.height/2;
        arc.x = this.compassBase.width/2;
        arc.y = this.compassBase.height/2;
        // rotate arc to straddle the wind direction
        arc.rotation = CompassRose.getRads(CompassRose.windDirection - 90 - degrees);
        
        
        this.noGoArc = arc;
        this.noGoArc.alpha = 0.33;
        this.addChildAt(this.noGoArc,1); //1 is just above 0, the compassBase
        this.noGoArc.visible = false;
    }

    public static getRads(degrees:number)
    {
        return degrees * Math.PI / 180;
    }

    public static getDegs(rads:number)
    {
        return rads * (180 / Math.PI);     
    }

    public static convertCartToCompass(degrees:number)
    {
        // take a cartesian heading in degrees (0 is along the x axis "to the right" and sweeps counter clockwise)
        // and convert it to compass rotation (0 is along the y axis "up" and sweeps clockwise)

        // cart will be from 0 -> 180 or 0 -> -180 for top or bottom hemisphere
        // compass rotations are just 0 -> 360

        let compassAngle = 0;

        if (degrees < 0) 
        {
            compassAngle = 90 + Math.abs(degrees);    
        }
        else if (degrees > 90)
        {
            compassAngle = 180 - degrees + 270;
        }
        else
        {
            compassAngle = 90 - degrees;
        }

        return compassAngle;
    }

    // set the ship we should track for heading info
    public trackShip(ship:Ship)
    {
        this.trackingShip = ship;
        this.setNoGo(this.trackingShip.getAngleToWind());
    }

    public update()
    {
        if (this.trackingShip)
            this.needleHeading.rotation = CompassRose.getRads(CompassRose.convertCartToCompass(this.trackingShip.getHeading()));
        // this.animRot += 0.1;
        // this.needleHeading.rotation = this.getRads(this.animRot);
        // console.log("HeadingNeedle rotation: " + this.animRot.toFixed(2));
    }
}