//
// popPrizeAgent class for buying reloads to the magazine and ship quests
//

import * as PIXI from 'pixi.js';
import PopUp from './popup';
import Button from './button';
import SingletonClass from './singleton';
import Ship from './ship';
import popMsgBox from './popmsgbox';
import popCoinStore from './popcoinstore';
import HealthBar from './healthbar';


export default class popPrizeAgent extends PopUp
{
    private lblShot:PIXI.Text;
    private lblCannon:PIXI.Text;
    private lblName:PIXI.Text;
    private txtShipName:PIXI.Text;
    private cannon:PIXI.Sprite;
    private ball:PIXI.Sprite;
    private lblTitle:PIXI.Text;
    private lblNextReload:PIXI.Text;
    private txtReloadTime:PIXI.Text;
    private coin:PIXI.Sprite;
    private txtReloadPrice:PIXI.Text;
    private btnBuyNow:Button;
    private btnReload:Button;
    private charPrizeAgent:PIXI.Sprite;
    // repair info
    private repairGold:PIXI.Sprite;
    private repairSilver:PIXI.Sprite;
    private txtRepairGold:PIXI.Text;
    private txtRepairSilver:PIXI.Text;
    private btnRepair:Button;
    private btnRepairNow:Button;
    private hullHealth:HealthBar;
    private lblHull:PIXI.Text;
    private lblNextRepair:PIXI.Text;
    private txtRepairTime:PIXI.Text;
    private repairPrice:number = 0;

    // footer
    private txtFooter:PIXI.Text;

    constructor()
    {
        super();
    }

    public init()
    {
        super.init(); // background and x button
        // add popup display items
        this.cannon = new PIXI.Sprite(PIXI.Texture.fromFrame("uiCannon.png"));
        this.cannon.x = 114 - this.cannon.width/2;
        this.cannon.y = 160 - this.cannon.height/2;
        this.addChild(this.cannon);
        this.ball = new PIXI.Sprite(PIXI.Texture.fromFrame("uiBall.png"));
        this.ball.x = 113 - this.ball.width/2;
        this.ball.y = 205 - this.ball.height/2;
        this.addChild(this.ball);

        var styleb = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 32,
            fill: 'black'
        });

        this.lblCannon = new PIXI.Text('x 6 4lb', styleb);
        this.lblCannon.x = this.cannon.x + this.cannon.width + 10;
        this.lblCannon.y = this.cannon.y;
        this.addChild(this.lblCannon);

        var boat = SingletonClass.ship;
        var sMag = boat.getMagBall() + " of " + boat.getMagBallMax();
        this.lblShot = new PIXI.Text(sMag, styleb);
        this.lblShot.x = this.ball.x + this.ball.width + 10;
        this.lblShot.y = this.ball.y;
        this.addChild(this.lblShot);

        var style = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 22,
            fill: 'black'
        });

        this.lblName = new PIXI.Text('Name:', style);
        this.lblName.x = 155;
        this.lblName.y = 66;
        this.addChild(this.lblName);

        var shipName = SingletonClass.ship.getName();
        this.txtShipName = new PIXI.Text(shipName, styleb);
        this.txtShipName.x = 155;
        this.txtShipName.y = 90;
        this.addChild(this.txtShipName);

        this.lblTitle = new PIXI.Text("Prize Agent", styleb);
        this.lblTitle.x = this.bg.width / 2 - this.lblTitle.width / 2;
        this.lblTitle.y = 30;
        this.addChild(this.lblTitle);

        this.lblNextReload = new PIXI.Text("Next Reload in: ", style);
        this.lblNextReload.x = 284;
        this.lblNextReload.y = 141;
        this.addChild(this.lblNextReload);

        this.txtReloadTime = new PIXI.Text("00:00:00 ", style);
        this.txtReloadTime.x = this.lblNextReload.x + this.lblNextReload.width + 5;
        this.txtReloadTime.y = this.lblNextReload.y;
        this.addChild(this.txtReloadTime);

        this.coin = new PIXI.Sprite(PIXI.Texture.fromFrame("goldCoin.png"));
        this.coin.x = 400 - this.coin.width/2;
        this.coin.y = 208 - this.coin.height/2;
        this.addChild(this.coin);

        this.txtReloadPrice = new PIXI.Text("10", style);
        this.txtReloadPrice.x = this.coin.x + this.coin.width + 5;
        this.txtReloadPrice.y = this.coin.y;
        this.addChild(this.txtReloadPrice);

        this.btnBuyNow = new Button(PIXI.Texture.fromFrame("btnLong.png"),false,"Buy Now", 18);
        this.btnBuyNow.x = 329; // - this.btnBuyNow.width/2;
        this.btnBuyNow.y = 204; // - this.btnBuyNow.height/2;
        this.addChild(this.btnBuyNow);
        this.btnBuyNow.on('click', this.onBuyNow);

        this.btnReload = new Button(PIXI.Texture.fromFrame("btnLong.png"), false, "Reload");
        this.btnReload.x = 217; //- this.btnReload.width / 2;
        this.btnReload.y = 254; // - this.btnReload.height / 2;
        this.addChild(this.btnReload);
        this.btnReload.on('click', this.onReload);

        this.charPrizeAgent = new PIXI.Sprite(PIXI.Texture.fromFrame("Prize Agent 300x450.png"));
        this.charPrizeAgent.x = 472;
        this.charPrizeAgent.y = 31;
        this.addChild(this.charPrizeAgent);

        // repair info
        this.lblNextRepair = new PIXI.Text("Next Repair in: ", style);
        this.lblNextRepair.x = 284;
        this.lblNextRepair.y = 275;
        this.addChild(this.lblNextRepair);

        this.txtRepairTime = new PIXI.Text("00:00:00 ", style);
        this.txtRepairTime.x = this.lblNextRepair.x + this.lblNextRepair.width + 5;
        this.txtRepairTime.y = this.lblNextRepair.y;
        this.addChild(this.txtRepairTime);

        this.lblHull = new PIXI.Text('Hull:', styleb);
        this.lblHull.x = 170;
        this.lblHull.y = 307;
        this.addChild(this.lblHull);

        this.hullHealth = new HealthBar(150,12,0xFF0000);
        this.hullHealth.x = this.lblHull.x + this.lblHull.width + 5;
        this.hullHealth.y = this.lblHull.y + 15;
        var perc = SingletonClass.ship.getHull() / SingletonClass.ship.getHullMax();
        this.hullHealth.setPerc(perc);
        this.addChild(this.hullHealth);

        this.repairSilver = new PIXI.Sprite(PIXI.Texture.fromFrame("silverCoin.png"));
        this.repairSilver.x = 424 - this.repairSilver.width/2;
        this.repairSilver.y = 324 - this.repairSilver.height/2;
        this.addChild(this.repairSilver);

        this.repairPrice = 50 * (1 - perc);
        var price = this.repairPrice;
        this.txtRepairSilver = new PIXI.Text(price.toFixed(0).toString(), style);
        this.txtRepairSilver.x = this.repairSilver.x + this.repairSilver.width + 5;
        this.txtRepairSilver.y = this.repairSilver.y;
        this.addChild(this.txtRepairSilver);

        this.btnRepair = new Button(PIXI.Texture.fromFrame("btnLong.png"), false, "Repair");
        this.btnRepair.x = 217;
        this.btnRepair.y = 369;
        this.addChild(this.btnRepair);
        this.btnRepair.on('click', this.onRepair);

        this.btnRepairNow = new Button(PIXI.Texture.fromFrame("btnLong.png"), false, "Buy Now", 18);
        this.btnRepairNow.x = 329;
        this.btnRepairNow.y = 369;
        this.addChild(this.btnRepairNow);
        this.btnBuyNow.on('click', this.onRepairNow);

        this.repairGold = new PIXI.Sprite(PIXI.Texture.fromFrame("goldCoin.png"));
        this.repairGold.x = 400 - this.repairGold.width/2;
        this.repairGold.y = 375 - this.repairGold.height/2;
        this.addChild(this.repairGold);

        this.txtRepairGold = new PIXI.Text("10", style);
        this.txtRepairGold.x = this.repairGold.x + this.repairGold.width + 5;
        this.txtRepairGold.y = this.repairGold.y;
        this.addChild(this.txtRepairGold);

        var stylec = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 16,
            fill: 'black',
            wordWrap: true,
            wordWrapWidth: 455
        });

        var footer = "I can reload your magazine or repair only so often. To do so more frequently will require exaction of the master at the dockyard.";
        this.txtFooter = new PIXI.Text(footer, stylec);
        this.txtFooter.x = 97;
        this.txtFooter.y = 466;
        this.addChild(this.txtFooter);

        requestAnimationFrame(this.update);
    }

    update = () =>
    {
        this.txtReloadTime.text = this.getTimeRemaining();

        requestAnimationFrame(this.update);
    }

    onRepair = (e:any) =>
    {
        if (SingletonClass.player.getSilver() >= this.repairPrice)
        {
            SingletonClass.ship.repairAll();
            this.hullHealth.setPerc(1);
            var decPrice = this.repairPrice.toFixed(0);
            SingletonClass.player.decSilver(this.repairPrice);
            this.repairPrice = 0;
            this.txtRepairSilver.text = "0";
        } else 
        {
            var msg = new popMsgBox();
            msg.initMsg(3,"Prize Agent", "It would appear your account balance is lacking sufficent funds. Mayhap you should take a prize or two?");
            SingletonClass.popupManager.displayPopup(msg);
            return;
        }
    }

    onRepairNow = (e:any) =>
    {

    }

    onBuyNow = (e:any) =>
    {
        var balls = SingletonClass.ship.getMagBall();
        if (balls == SingletonClass.ship.getMagBallMax())
        {
            var msg = new popMsgBox();
            msg.initMsg(0,"1st Mate", "Our magazine is full captain! No need to reload right now.");
            SingletonClass.popupManager.displayPopup(msg);
            return;
        }

        if (SingletonClass.player.getGold() >= 10)
        {
            SingletonClass.player.decGold(10);
            SingletonClass.ship.fillMagazine();
            var sMag = SingletonClass.ship.getMagBall() + " of " + SingletonClass.ship.getMagBallMax();
            this.lblShot.text = sMag;

            var msg = new popMsgBox();
            msg.initMsg(3,"Prize Agent", "Yes, exaction is the best way to deal with the armory...");
            SingletonClass.popupManager.displayPopup(msg);
    
            console.log("Refilled Mag! lastReload = " + SingletonClass.player.lastReload);
        }
        else
        {
            // display the coin store
            var pop = new popCoinStore();
            SingletonClass.popupManager.displayPopup(pop);
        }
    }

    onReload = () =>
    {
        // var pop = new popMsgBox();
        // pop.initMsg(0, "Important Message!", "Really boss! I thought this was important to tell you right now");
        // this.popupManager.displayPopup(pop);
        var balls = SingletonClass.ship.getMagBall();
        if (balls == SingletonClass.ship.getMagBallMax())
        {
            var msg = new popMsgBox();
            msg.initMsg(0,"1st Mate", "Our magazine is full captain! No need to reload right now.");
            SingletonClass.popupManager.displayPopup(msg);
            return;
        }

        if (this.txtReloadTime.text != "Ready!")
        {
            var msg2 = new popMsgBox();
            msg2.initMsg(3,"Prize Agent", "I cannot reload your magazine at the moment. Unless you're willing to bribe the armory...");
            SingletonClass.popupManager.displayPopup(msg2);
            return;
        }

        var now = Date.now();
        SingletonClass.player.lastReload = now;

        SingletonClass.ship.fillMagazine();
        var sMag = SingletonClass.ship.getMagBall() + " of " + SingletonClass.ship.getMagBallMax();
        this.lblShot.text = sMag;

        console.log("Refilled Mag! lastReload = " + SingletonClass.player.lastReload);
    }

    private  getTimeRemaining() {
        if (SingletonClass.player.lastReload == 0)
            return "Ready!";

        var now = Date.now();
        var t = now - SingletonClass.player.lastReload;

        if (t > SingletonClass.player.reloadTime)
            return "Ready!";

        // if not zero, or elapsed, we are within the time window, determine how much is left
        t = SingletonClass.player.reloadTime - t; 

        var seconds = Math.floor( (t/1000) % 60 );
        var minutes = Math.floor( (t/1000/60) % 60 );
        var hours = Math.floor( (t/(1000*60*60)) % 24 );
        //console.log(hours + ":" + minutes + ":" +  seconds);
        var strTime = Ship.zeroPad(hours, 2) + ":" + Ship.zeroPad(minutes, 2) + ":" + Ship.zeroPad(seconds, 2);
        return strTime;
    }
}