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
    private windDirection:PIXI.Sprite;  // wind direction indicator
    private trackingShip:Ship;
    private animRot:number = 0;
    private mouseDown:boolean = false;
    private trackedNewHeading:number = 0;

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
        this.needleHeading.x = 200;
        this.needleHeading.y = 200;
        this.needleHeading.rotation = CompassRose.getRads(15);

        // the ghost heading needle
        this.needleGhostHeading = new PIXI.Sprite(PIXI.Texture.fromFrame("needleShip.png"));
        this.needleGhostHeading.anchor.x = 0.5;
        this.needleGhostHeading.anchor.y = 1;   // anchor at center bottom
        this.needleGhostHeading.x = 200;
        this.needleGhostHeading.y = 200;
        this.needleGhostHeading.rotation = CompassRose.getRads(15);
        this.needleGhostHeading.visible = false;
        this.needleGhostHeading.alpha = 0.67;

        this.needleCannon = new PIXI.Sprite(PIXI.Texture.fromFrame("needleCannon.png"));
        // this.needleCannon.pivot.x = this.needleCannon.width / 2;
        // this.needleCannon.pivot.y = this.needleCannon.height;  // bottom center of sprite
        this.needleCannon.anchor.x = 0.5;
        this.needleCannon.anchor.y = 1;   // anchor at center bottom
        this.needleCannon.x = 200;
        this.needleCannon.y = 200; // centered on compass base
        this.needleCannon.rotation = CompassRose.getRads(105);

        this.windDirection = new PIXI.Sprite(PIXI.Texture.fromFrame("WindIndicator.png"));
        // this.windDirection.pivot.x = 29;
        // this.windDirection.pivot.y = 183;  // will rotate around this point against the compass base background
        this.windDirection.anchor.x = 0.5;
        this.windDirection.anchor.y = 2.5;
        this.windDirection.x = 200; //this.compassBase.width / 2 - this.windDirection.width / 2;
        this.windDirection.y = 200; //17; // magic number

        this.addChild(this.compassBase);    // z order will be in child order, back to front
        this.addChild(this.windDirection);
        this.addChild(this.needleHeading);
        this.addChild(this.needleGhostHeading);
        this.addChild(this.needleCannon);
        this.addChild(this.starCap);

        this.needleHeading.interactive = true;
        this.needleHeading.on("mousedown", this.mouseDownHandler);

        this.needleHeading.on("mousemove", this.mouseMoveHandler);
        this.needleHeading.on("mouseup", this.mouseUpHandler);
    }

    private endSetHeading() {
        if (this.mouseDown == true) {
            this.mouseDown = false;

            console.log("CompassRose: END ghost heading");
            
            var myEvent = new CustomEvent("changeHeading",
            {
                'detail': this.trackedNewHeading
            });
    
            window.dispatchEvent(myEvent);
        }
        // else ignore - might be called as mouse moves without mousedown
    }

    mouseMoveHandler = (e:any) => {
        
        if (e.data.buttons == 0)
            this.endSetHeading();

        // mouse has moved, find the angle relative to the center of the compass and rotate the ghost image there
        if (this.mouseDown) {
            this.needleGhostHeading.visible = true;
            // get local coords from mouse coords
            let locPt = this.toLocal(new PIXI.Point(e.data.global.x,e.data.global.y));
            // get a vector from these coords
            let vic = new Victor(locPt.x - this.compassBase.width/2, -(locPt.y - this.compassBase.height/2));
            let angDeg = vic.angleDeg();
            this.needleGhostHeading.rotation = CompassRose.getRads(CompassRose.convertCartToCompass(angDeg));
            //console.log("Mouse Degrees: " + vic.angleDeg());
            this.trackedNewHeading = angDeg;
        }

    }

    mouseDownHandler = (e:any) => {
        if (e.target == this.needleHeading)
        {
            this.mouseDown = true;
            console.log("CompassRose: START ghost heading");
        }
        
    }

    mouseUpHandler = (e:any) => {
        // release mouse no matter what the e.target was
        this.endSetHeading();
    }

    public static getRads(degrees:number)
    {
        return degrees * Math.PI / 180;
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