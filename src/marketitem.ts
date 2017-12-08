//
// MarketItem - container class for each market item displayed within the market popup
//
import * as PIXI from 'pixi.js';
import EconomyIcon from './economyicon';

export default class MarketItem extends PIXI.Container
{
    private bullbear:PIXI.Sprite;
    private item:EconomyIcon;
    private exact:PIXI.Container;
    private rate:number;

    constructor(itemid:number, marketRate:number, up:boolean)
    {
        super();

        if (up)
            this.bullbear = new PIXI.Sprite(PIXI.Texture.fromFrame("bull.png"));
        else
            this.bullbear = new PIXI.Sprite(PIXI.Texture.fromFrame("bear.png"));

        this.item = new EconomyIcon(itemid, 0,false,0);
        this.item.x = 21;
        this.item.y = 21;
        this.addChild(this.item);

        this.bullbear.x = -this.bullbear.width - 5;
        this.addChild(this.bullbear);

        this.addPips(marketRate);
        this.rate = marketRate;
    }

    private addPips(rate:number)
    {
        // 10 pips.. each is 10% value...
        var fullPips = Math.floor(rate / 10); 
        var empties = 10 - fullPips;
        var exact = rate % 10 * 10 / 100;
        var xSpot = this.item.x + this.item.width/2 +  5; // econicons are center anchor
        // add full pips
        var pip, i;
        for (i=0; i<fullPips; i++) {
            pip = new PIXI.Graphics();
            pip.beginFill(0x705337);
            pip.drawCircle(21,21,21);
            pip.endFill();
            pip.x = xSpot;
            pip.y = 0;
            xSpot += 47;
            this.addChild(pip);
        }
        // add the exact pip
        if (exact != 0) {
            this.exact = new PIXI.Container();
            pip = new PIXI.Graphics();
            pip.beginFill(0x705337);
            pip.drawCircle(21,21,21);
            pip.endFill();
            pip.x = 0;
            pip.y = 0;
            this.exact.addChild(pip);
            var mask = new PIXI.Graphics();
            mask.beginFill(0xFFFFFF);
            mask.drawRect(0,0,42,42);
            mask.x = -(42 * (1 - exact));
            this.exact.addChild(mask);
            this.exact.mask = mask;
            this.exact.x = xSpot;
            this.addChild(this.exact);
        }
        // add empty pips
        for (i=0; i<empties; i++) {
            pip = new PIXI.Graphics();
            pip.lineStyle(1, 0x705337);  //(thickness, color)
            pip.drawCircle(21,21,21);
            pip.endFill();
            pip.x = xSpot;
            xSpot += 47;
            this.addChild(pip);
        }
    }

    public getName()
    {
        return this.item.getName();
    }

    public getPrice()
    {
        var p =this.item.getPrice();
        return Math.floor(p + Math.ceil(p *  this.rate / 100));
    }
}