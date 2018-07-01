//
// ShipDetail popup screen to display hold, magazine, and ship stats
//

import * as PIXI from 'pixi.js';
import PopUp from './popup';
import Ship from './ship';
import Button from './button';
import HealthBar from './healthbar';
import SingletonClass from './singleton';

export default class popBoatStore extends PopUp
{
    private boat:Ship;
    private sailHealth:HealthBar;
    private crewHealth:HealthBar;
    private hullHealth:HealthBar;
    private lblSails:PIXI.Text;
    private lblCrew:PIXI.Text;
    private lblHull:PIXI.Text;
    private txtHullValue:PIXI.Text;
    private lblHold:PIXI.Text;
    private txtHoldValue:PIXI.Text;
    private txtShipCost:PIXI.Text;

    private lblShot:PIXI.Text;
    private lblCannon:PIXI.Text;
    private lblName:PIXI.Text;
    private txtShipName:PIXI.Text;
    private btnBuy:Button;

    private lblStore:PIXI.Text;

    private pageUp:Button;
    private pageDown:Button;

    private boatKey:string;
    private configIndex:number;

    private silverCoin:PIXI.Sprite;
    private goldCoin:PIXI.Sprite; 

    private boatImage:PIXI.Sprite;

    private lblType:PIXI.Text;
    private txtType:PIXI.Text;


    constructor()
    {
        super();
    }

    public init()
    {
        super.init(); // load background and X button

        // load and position our graphics
        this.boatKey = "xebec"
        this.boatImage = new PIXI.Sprite(); 
        this.getShipImage();
        this.addChild(this.boatImage);


        this.btnBuy = new Button(PIXI.Texture.fromFrame("btnLong.png"), false, "Buy");
        this.btnBuy.x = 311;
        this.btnBuy.y = 473;
        this.addChild(this.btnBuy);
        this.btnBuy.on('click', this.onBuy);

        var s = this.silverCoin = new PIXI.Sprite(PIXI.Texture.fromFrame("silverCoin.png"));
        s.x = 330 - s.width/2;
        s.y = 433 - s.height/2;
        this.addChild(s);
        s = this.goldCoin = new PIXI.Sprite(PIXI.Texture.fromFrame("goldCoin.png"));
        s.x = 330 - s.width/2;
        s.y = 433 - s.height/2;
        this.addChild(s);

        this.goldCoin.visible = false;

        s = new PIXI.Sprite(PIXI.Texture.fromFrame("uiCannon.png"));
        s.x = 156 - s.width/2;
        s.y = 213 - s.height/2;
        this.addChild(s);
        s = new PIXI.Sprite(PIXI.Texture.fromFrame("uiBall.png"));
        s.x = 155 - s.width/2;
        s.y = 258 - s.height/2;
        this.addChild(s);

        // health bars
        this.sailHealth = new HealthBar(150,12,0x0000FF);
        this.sailHealth.x = 173;
        this.sailHealth.y = 292;
        this.addChild(this.sailHealth);
        this.crewHealth = new HealthBar(150,12,0x00FF00);
        this.crewHealth.x = 173;
        this.crewHealth.y = 323;
        this.addChild(this.crewHealth);
        this.hullHealth = new HealthBar(150,12,0xFF0000);
        this.hullHealth.x = 173;
        this.hullHealth.y = 353;
        // var perc = this.boat.getHull() / this.boat.getHullMax();
        // this.hullHealth.setPerc(perc);
        this.addChild(this.hullHealth);
        var style = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 22,
            fill: 'black'
        });

        var stylew = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 22,
            fill: 'white'
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
        this.txtHullValue = new PIXI.Text('120', stylew);
        this.txtHullValue.x = this.hullHealth.x  + this.hullHealth.width + 5;
        this.txtHullValue.y = this.hullHealth.y + this.hullHealth.height / 2 - this.lblHull.height / 2 - 4;
        this.addChild(this.txtHullValue);

        this.lblHold = new PIXI.Text('Hold:', style);
        this.lblHold.x = 213;
        this.lblHold.y = 420;
        this.addChild(this.lblHold);
        this.txtHoldValue = new PIXI.Text('40', stylew);
        this.txtHoldValue.x = this.lblHold.x  + this.lblHold.width + 5;
        this.txtHoldValue.y = this.lblHold.y + this.lblHold.height / 2 - this.txtHoldValue.height / 2 - 2;
        this.addChild(this.txtHoldValue);

        this.lblType = new PIXI.Text('Type:', style);
        this.lblType.x = 115;
        this.lblType.y = 112;
        this.addChild(this.lblType);
        this.txtType = new PIXI.Text('Corvette - Stock', style);
        this.txtType.x = 115;
        this.txtType.y = this.lblType.y + this.lblType.height;
        this.addChild(this.txtType);


        this.txtShipCost = new PIXI.Text('1,000', stylew);
        this.txtShipCost.x = 348;
        this.txtShipCost.y = this.txtHoldValue.y;
        this.addChild(this.txtShipCost);

        var styleb = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 32,
            fill: 'black'
        });

        var sMag = "Magazine: " + "15";
        this.lblShot = new PIXI.Text(sMag, styleb);
        this.lblShot.x = this.sailHealth.x + this.sailHealth.width / 2 - this.lblShot.width /2 + 20;
        this.lblShot.y = 236;
        this.addChild(this.lblShot);

        this.lblCannon = new PIXI.Text('x 6 4lb', styleb);
        this.lblCannon.x = this.sailHealth.x + this.sailHealth.width / 2 - this.lblShot.width /2 + 20;
        this.lblCannon.y = 194;
        this.addChild(this.lblCannon);

        this.lblName = new PIXI.Text('Name:', style);
        this.lblName.x = 384;
        this.lblName.y = 381;
        this.addChild(this.lblName);

        this.txtShipName = new PIXI.Text('\"' + "Boat Name" + '\"', style);
        this.txtShipName.x = 446;
        this.txtShipName.y = 381;
        this.addChild(this.txtShipName);

        this.lblStore = new PIXI.Text('Ship Store', styleb);
        this.lblStore.x = 194;
        this.lblStore.y = 40;
        this.addChild(this.lblStore);

        this.pageDown = new Button(PIXI.Texture.fromFrame("uiArrow.png"));
        this.pageDown.rotation = Math.PI + Math.PI / 2;
        this.pageDown.x = 433;
        this.pageDown.y = 476;
        this.addChild(this.pageDown);
        this.pageDown.on('click',this.onPageDown);

        this.pageUp = new Button(PIXI.Texture.fromFrame("uiArrow.png"));
        //this.pageUp.scale.y = -1;
        this.pageUp.rotation = Math.PI / 2; // 180 degrees
        this.pageUp.x = 187;
        this.pageUp.y = 475;
        this.addChild(this.pageUp);
        this.pageUp.on('click', this.onPageUp);

        this.boatKey = "xebec";
        this.configIndex = 0;

        this.displayOption();

    }

    // display the config indicated by boatIndex and configIndex
    private displayOption()
    {
        var boatData = SingletonClass.getBoatData()[this.boatKey];
        
        //set the values
        this.lblCannon.text = "x " + boatData.configs[this.configIndex].cannons + " 4lb";
        this.txtHoldValue.text = boatData.configs[this.configIndex].hold;
        this.txtHullValue.text = boatData.configs[this.configIndex].hull;
        this.txtShipCost.text = boatData.configs[this.configIndex].cost;

        if (boatData.configs[this.configIndex].coin == "silver") {
            this.silverCoin.visible = true;
            this.goldCoin.visible = false;
        } else {
            this.silverCoin.visible = false;
            this.goldCoin.visible = true; 
        }

        this.txtType.text = boatData.displayName + " - " + boatData.configs[this.configIndex].type;
    }

    onBuy = (e:any) =>
    {
    }

    onPageDown = (e:any) =>
    {
        var boatData = SingletonClass.getBoatData()[this.boatKey];
        // increment index
        this.configIndex++;
        if (this.configIndex >= boatData.configs.length)
        {
            // boat key to next ship type
            this.getNextBoat();
            // config to zero
            this.configIndex = 0;
        }

        this.displayOption();
    }

    onPageUp = (e:any) =>
    {
        var boatData = SingletonClass.getBoatData()[this.boatKey];
        // increment index
        this.configIndex--;
        if (this.configIndex < 0)
        {
            // boat key to next ship type
            this.getPrevBoat();
            // config to last config of previous boat
            var boatData = SingletonClass.getBoatData()[this.boatKey];
            this.configIndex = boatData.configs.length -1;
        }

        this.displayOption();
    }

    private getNextBoat()
    {
        if(this.boatKey == "corvette")
            this.boatKey = "xebec";
        else if (this.boatKey == "xebec")
            this.boatKey = "brig";
        else // brig
            this.boatKey = "corvette";

        this.getShipImage();
    }

    private getPrevBoat()
    {
        if(this.boatKey == "corvette")
            this.boatKey = "brig";
        else if (this.boatKey == "xebec")
            this.boatKey = "corvette";
        else // brig
            this.boatKey = "xebec";
            
        this.getShipImage();
    }

    private getShipImage()
    {
        // switch off of ship type
        if (this.boatKey == "corvette") {
            this.boatImage.texture = PIXI.Texture.fromFrame("uiCorvette.png");
            this.boatImage.x = 576 - this.boatImage.width/2;
            this.boatImage.y = 146 - this.boatImage.height/2; // coordinate in flash are based off its center
        }
        else if (this.boatKey == "xebec"){
            this.boatImage.texture = PIXI.Texture.fromFrame("uiXebec.png");
            this.boatImage.x = 546 - this.boatImage.width/2;
            this.boatImage.y = 226 - this.boatImage.height/2; // coordinate in flash are based off its center
        }
        else {
            this.boatImage.texture = PIXI.Texture.fromFrame("uiBrig.png");
            this.boatImage.x = 576 - this.boatImage.width/2;
            this.boatImage.y = 161 - this.boatImage.height/2; // coordinate in flash are based off its center
        }

    }
}