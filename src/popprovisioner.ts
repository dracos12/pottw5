//
// popProvisioner class for buying selling provisions in town. This is where the player will
//                  sell the stuff in their boat hold and buy ships provisions for thier boat
//
import * as PIXI from 'pixi.js';
import PopUp from './popup';
import Button from './button';


export default class popProvisioner extends PopUp
{
    private bg:PIXI.Sprite; // the backdrop
    private btnX:Button;    // the close button 
    private mercBack:PIXI.Sprite;
    private holdBack:PIXI.Sprite;
    private sellBtn:Button;
    private txtAmount:PIXI.Text;

    constructor()
    {
        super();
    }

    public init()
    {
        // backdrop adds first
        this.bg = new PIXI.Sprite(PIXI.Texture.fromFrame("ui_map.png"));
        this.addChild(this.bg);
        // btnEX!
        this.btnX = new Button(PIXI.Texture.fromFrame("Btn_Ex.png"));
        this.btnX.x = 713;
        this.btnX.y = 42;
        this.btnX.on('click', this.btnXClick);
        this.addChild(this.btnX);

        this.mercBack = new PIXI.Sprite(PIXI.Texture.fromFrame("HoldBack.png"));
        this.mercBack.x = 336 - this.mercBack.width/2;
        this.mercBack.y = 189 - this.mercBack.height/2;
        this.addChild(this.mercBack);

        this.holdBack = new PIXI.Sprite(PIXI.Texture.fromFrame("HoldBack.png"));
        this.holdBack.x = 336 - this.holdBack.width/2;
        this.holdBack.y = 417 - this.holdBack.height/2;
        this.addChild(this.holdBack);

        var style = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 22,
            fill: 'black'
        });
        
        var lbl = new PIXI.Text('Merchant:', style);
        lbl.x = this.mercBack.x;
        lbl.y = this.mercBack.y - lbl.height - 2;
        this.addChild(lbl);

        lbl = new PIXI.Text('Hold:', style);
        lbl.x = this.holdBack.x;
        lbl.y = this.holdBack.y - lbl.height - 2;
        this.addChild(lbl);

        var styleb = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 32,
            fill: 'black'
        });

        lbl = new PIXI.Text('Provisioner:', styleb);
        lbl.x = this.mercBack.x + this.mercBack.width/2 - lbl.width / 2;
        lbl.y = 35;
        this.addChild(lbl);

        this.sellBtn = new Button(PIXI.Texture.fromFrame("sellBtn.png"));
        this.sellBtn.x = 531;
        this.sellBtn.y = 302;
        this.sellBtn.scale.x = this.sellBtn.scale.y = 0.67;
        this.addChild(this.sellBtn);

        var s = new PIXI.Sprite(PIXI.Texture.fromFrame("silverCoin.png"));
        s.x = 329 - s.width/2;
        s.y = 306 - s.height/2;
        this.addChild(s);

        var stylec = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 22,
            fill: 'white'
        });
        this.txtAmount = new PIXI.Text('0', stylec);
        this.txtAmount.x = s.x + s.width + 5;
        this.txtAmount.y = s.y + s.height/2 - this.txtAmount.height/2;
        this.addChild(this.txtAmount);
    }

    private btnXClick = () =>
    {
        this.close(); // will callback to popupmanager to remove us from display
    }

}