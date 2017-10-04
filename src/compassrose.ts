//
// CompassRose class widget 
//  displays ship heading, cannon angle, and wind direction
//  ship heading is interactive and allows the player to change the heading
//  allows the player to adjust the cannon angle as well
//

import * as PIXI from 'pixi.js';

export default class CompassRose extends PIXI.Container
{
    private compassBase:PIXI.Sprite; // base with 32 headings
    private starCap:PIXI.Sprite;     // star cap to hide the bases of the layered needles beneath it
    private needleHeading:PIXI.Sprite; // ship heading needle
    private needleCannon:PIXI.Sprite; // cannon needle
    private windDirection:PIXI.Sprite;  // wind direction indicator

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
        this.needleHeading.rotation = this.getRads(15);

        this.needleCannon = new PIXI.Sprite(PIXI.Texture.fromFrame("needleCannon.png"));
        // this.needleCannon.pivot.x = this.needleCannon.width / 2;
        // this.needleCannon.pivot.y = this.needleCannon.height;  // bottom center of sprite
        this.needleCannon.anchor.x = 0.5;
        this.needleCannon.anchor.y = 1;   // anchor at center bottom
        this.needleCannon.x = 200;
        this.needleCannon.y = 200; // centered on compass base
        this.needleCannon.rotation = this.getRads(105);

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
        this.addChild(this.needleCannon);
        this.addChild(this.starCap);
    }

    private getRads(degrees:number)
    {
        return degrees * Math.PI / 180;
    }
}