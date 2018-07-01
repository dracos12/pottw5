//
// ShipDetail popup screen to display hold, magazine, and ship stats
//

import * as PIXI from 'pixi.js';
import PopUp from './popup';
import Ship from './ship';
import Button from './button';
import HealthBar from './healthbar';
import EconomyIcon from './economyicon';

export default class popShipDetails extends PopUp
{
    private boat:Ship;
    private sailHealth:HealthBar;
    private crewHealth:HealthBar;
    private hullHealth:HealthBar;
    private lblSails:PIXI.Text;
    private lblCrew:PIXI.Text;
    private lblHull:PIXI.Text;
    private lblHold:PIXI.Text;
    private lblShot:PIXI.Text;
    private lblCannon:PIXI.Text;
    private lblName:PIXI.Text;
    private txtShipName:PIXI.Text;

    private holdBack:PIXI.Sprite;

    constructor(boat:Ship)
    {
        super();
        this.boat = boat;
    }

    public init()
    {
        super.init(); // load background and X button

        // load and position our graphics
        var s = this.getShipImage();
        s.x = 603 - s.width/2;
        s.y = 94 - s.height/2; // coordinate in flash are based off its center
        this.addChild(s);

        this.holdBack = new PIXI.Sprite(PIXI.Texture.fromFrame("HoldBack.png"));
        this.holdBack.x = 348 - this.holdBack.width/2;
        this.holdBack.y = 379 - this.holdBack.height/2;
        this.addChild(this.holdBack);
        s = new PIXI.Sprite(PIXI.Texture.fromFrame("silverCoin.png"));
        s.x = 505 - s.width/2;
        s.y = 505 - s.height/2;
        this.addChild(s);
        s = new PIXI.Sprite(PIXI.Texture.fromFrame("uiCannon.png"));
        s.x = 131 - s.width/2;
        s.y = 112 - s.height/2;
        this.addChild(s);
        s = new PIXI.Sprite(PIXI.Texture.fromFrame("uiBall.png"));
        s.x = 130 - s.width/2;
        s.y = 158 - s.height/2;
        this.addChild(s);

        // health bars
        this.sailHealth = new HealthBar(150,12,0x0000FF);
        this.sailHealth.x = 149;
        this.sailHealth.y = 192;
        this.addChild(this.sailHealth);
        this.crewHealth = new HealthBar(150,12,0x00FF00);
        this.crewHealth.x = 149;
        this.crewHealth.y = 223;
        this.addChild(this.crewHealth);
        this.hullHealth = new HealthBar(150,12,0xFF0000);
        this.hullHealth.x = 149;
        this.hullHealth.y = 252;
        var perc = this.boat.getHull() / this.boat.getHullMax();
        this.hullHealth.setPerc(perc);
        this.addChild(this.hullHealth);
        var style = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 22,
            fill: 'black'
        });
        
        this.lblSails = new PIXI.Text('Sails:', style);
        this.lblSails.x = this.sailHealth.x  - this.lblSails.width - 5;
        this.lblSails.y = this.sailHealth.y + this.sailHealth.height / 2 - this.lblSails.height / 2;
        this.addChild(this.lblSails);

        this.lblCrew = new PIXI.Text('Crew:', style);
        this.lblCrew.x = this.crewHealth.x  - this.lblCrew.width - 5;
        this.lblCrew.y = this.crewHealth.y + this.crewHealth.height / 2 - this.lblCrew.height / 2;
        this.addChild(this.lblCrew);

        this.lblHull = new PIXI.Text('Hull:', style);
        this.lblHull.x = this.hullHealth.x  - this.lblHull.width - 5;
        this.lblHull.y = this.hullHealth.y + this.hullHealth.height / 2 - this.lblHull.height / 2;
        this.addChild(this.lblHull);

        this.lblHold = new PIXI.Text('Hold:', style);
        this.lblHold.x = this.holdBack.x;
        this.lblHold.y = this.holdBack.y + this.holdBack.height + 3;
        this.addChild(this.lblHold);
        var styleb = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 32,
            fill: 'black'
        });
        var sMag = this.boat.getMagBall() + " of " + this.boat.getMagBallMax();
        this.lblShot = new PIXI.Text(sMag, styleb);
        this.lblShot.x = this.sailHealth.x + this.sailHealth.width / 2 - this.lblShot.width /2;
        this.lblShot.y = 135;
        this.addChild(this.lblShot);

        this.lblCannon = new PIXI.Text('x 6 4lb', styleb);
        this.lblCannon.x = this.sailHealth.x + this.sailHealth.width / 2 - this.lblShot.width /2;
        this.lblCannon.y = 93;
        this.addChild(this.lblCannon);

        this.lblName = new PIXI.Text('Name:', style);
        this.lblName.x = 172;
        this.lblName.y = 18;
        this.addChild(this.lblName);

        this.txtShipName = new PIXI.Text('\"' + this.boat.getName() + '\"', style);
        this.txtShipName.x = 172;
        this.txtShipName.y = 43;
        this.addChild(this.txtShipName);

        this.loadHold();

    }

    private loadHold()
    {
        var hold = this.boat.getHold();
        console.log(hold);
        for (var i=0; i<hold.length; i++)
        {
            var e = new EconomyIcon(hold[i].type, i, false,hold[i].rarity);
            // place in our 10x4 grid
            e.x = ((i % 10) * 42) + i%10*3 + 21; // icons are center anchor
            e.y = (Math.floor(i/10) * 42) + Math.floor(i/10)*3 + 21; // adjust for center anchor
            e.x += this.holdBack.x + 10;
            e.y += this.holdBack.y + 4;
            this.addChild(e);
        }
    }

    private getShipImage()
    {
        // switch off of ship type
        return new PIXI.Sprite(PIXI.Texture.fromFrame("uiCorvette.png"));
    }
}