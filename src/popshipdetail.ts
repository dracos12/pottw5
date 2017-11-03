//
// ShipDetail popup screen to display hold, magazine, and ship stats
//

import * as PIXI from 'pixi.js';
import PopUp from './popup';

export default class popShipDetails extends PopUp
{
    constructor()
    {
        super();
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
        s = new PIXI.Sprite(PIXI.Texture.fromFrame("Btn_Ex.png"));
        s.x = 713 - s.width/2;
        s.y = 42 - s.height/2;
        this.addChild(s);
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
}