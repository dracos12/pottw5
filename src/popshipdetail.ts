//
// ShipDetail popup screen to display hold, magazine, and ship stats
//

import * as PIXI from 'pixi.js';
import PopUp from './popup';
import Ship from './ship';
import Button from './button';

export default class popShipDetails extends PopUp
{
    private boat:Ship;

    constructor(boat:Ship)
    {
        super();
        this.boat = boat;
    }

    public init()
    {
        // load and position our graphics
        var s = new PIXI.Sprite(PIXI.Texture.fromFrame("ui_map.png"));
        this.addChild(s);
        s = this.getShipImage();
        s.x = 603 - s.width/2;
        s.y = 94 - s.height/2; // coordinate in flash are based off its center
        this.addChild(s);
        var b = new Button( PIXI.Texture.fromFrame("Btn_Ex.png"));
        b.anchor.x = b.anchor.y = 0.5;
        b.x = 713;
        b.y = 42;
        //b.interactive = true;
        b.on('click', this.btnXClick);
        this.addChild(b);
        s = new PIXI.Sprite(PIXI.Texture.fromFrame("sellBtn.png"));
        s.x = 649 - s.width/2;
        s.y = 400 - s.height/2;
        this.addChild(s);
        s = new PIXI.Sprite(PIXI.Texture.fromFrame("HoldBack.png"));
        s.x = 348 - s.width/2;
        s.y = 379 - s.height/2;
        this.addChild(s);
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
    }

    private getShipImage()
    {
        // switch off of ship type
        return new PIXI.Sprite(PIXI.Texture.fromFrame("uiCorvette.png"));
    }

    private btnXClick = () =>
    {
        this.close(); // will callback to popupmanager to remove us from display
    }
}