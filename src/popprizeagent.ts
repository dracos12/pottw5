//
// popPrizeAgent class for buying reloads to the magazine and ship quests
//

import * as PIXI from 'pixi.js';
import PopUp from './popup';
import Button from './button';
import SingletonClass from './singleton';


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

        this.txtShipName = new PIXI.Text('\"The Donna Doctrine\"', styleb);
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
    }
}