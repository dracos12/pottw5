//
// StoreCard - class to display a store item
//

import * as PIXI from 'pixi.js';
import * as filters from 'pixi-filters';

export default class StoreCard extends PIXI.Container
{
    private cardBack:PIXI.Sprite;
    private txtName:PIXI.Text;
    private txtPrice:PIXI.Text;
    private itemID:number;
    private coinIcon:PIXI.Sprite;
    private itemImage:PIXI.Sprite;
    private glow:filters.GlowFilter;
    private glowing:boolean = false;
    private callBack:Function = null;

    constructor(name:string, price:string, id:number, coin:number, cb:Function=null,imageName:string="")
    {
        super();
        this.cardBack = new PIXI.Sprite(PIXI.Texture.fromFrame("cardBack.png"));
        this.addChild(this.cardBack);
        var style = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 22,
            fill: 'white'
        });

        this.itemID = id;
        
        // coin 1 = silver, coin 2 = gold, coin 0 = display no coin
        if (coin == 1)
            this.coinIcon = new PIXI.Sprite(PIXI.Texture.fromFrame("silverCoin.png"));
        else if (coin == 2)
            this.coinIcon = new PIXI.Sprite(PIXI.Texture.fromFrame("goldCoin.png"));

        if (coin != 0)
        {
            this.coinIcon.x = 34 - this.coinIcon.width / 2;
            this.coinIcon.y = 17 - this.coinIcon.height / 2;
            this.addChild(this.coinIcon);
        }

        if (imageName != "")
        {
            // add an image with indicated name to the frame
            // center based off the 90x145 space on the card from position 15,34
            this.itemImage = new PIXI.Sprite(PIXI.Texture.fromFrame(imageName));
            this.itemImage.x = 15 + 45 - (this.itemImage.width / 2);
            this.itemImage.y = 34 + 72 - (this.itemImage.height / 2);
            this.addChild(this.itemImage);
        }

        this.txtName = new PIXI.Text(name, style);
        this.txtName.x = 48;
        this.txtName.y = 1;
        this.addChild(this.txtName);

        this.txtPrice = new PIXI.Text(price, style);
        this.txtPrice.x = 39;
        this.txtPrice.y = 151;
        this.addChild(this.txtPrice);

        this.interactive = true;
        this.on('mousedown', this.onMouseDown);

        this.glow = new filters.GlowFilter(10, 1, 1, 0xFFFFFF);

        this.callBack = cb;
    }

    public getID()
    {
        return this.itemID;
    }

    onMouseDown = () => 
    {
        // apply glow filter
        this.filters = [this.glow];
        this.glowing = true;
        if (this.callBack != null)
            this.callBack(this.itemID); // call the call back with our item id
    }

    public isGlowing()
    {
        return this.glowing;
    }

    public removeGlow()
    {
        this.filters = [];
    }

}