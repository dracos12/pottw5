//
// popMarket - popup to display MarketItem market values for economy icons at the current port
//
import * as PIXI from 'pixi.js';
import PopUp from './popup';
import Button from './button';
import MarketItem from './marketitem';
import theSea from './theSea';
import SingletonClass from './singleton';
import EconomyItem from './economyitem';

export default class popMarket extends PopUp
{
    private txtHeader:PIXI.Text;
    private txtMouseOver:PIXI.Text;
    private txtPrice:PIXI.Text;
    private coin:PIXI.Sprite;
    private marketItems:Array<MarketItem> = [];
    private marketData:any;
    private pageIndex:number=0; // index of the market item for this page of results
    private pageUp:Button;
    private pageDown:Button;

    constructor()
    {
        super();
    }

    public init()
    {
        super.init(); // background and X button with handler
        var data = this.getMarketData();
        var i,m,rate,up;
        for (i=0; i<EconomyItem.maxItems; i++)
        {
            rate = data[i].rate;
            up = data[i].up;
            m = new MarketItem(i,rate,up);
            this.addChild(m);
            if (i<8) // position and add the first page
            {
                m.x = 113;
                m.y = 94 + (i * (m.height + 5));
                m.visible = true;
            } else {
                m.visible = false;
            }

            //console.log("item: " + i + "rate: " + rate + " up: " + up);
            m.interactive = true;
            m.on('mouseover',this.itemOver);
            
            this.marketItems.push(m);
        }

        var styleb = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 32,
            fill: 'black'
        });
        var town = SingletonClass.currentPort;
        var title = town + " Market";
        this.txtHeader = new PIXI.Text(title, styleb);
        this.txtHeader.x = this.bg.width / 2 - this.txtHeader.width / 2;
        this.txtHeader.y = 40;
        this.addChild(this.txtHeader);

        var style = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 22,
            fill: 'black'
        });

        this.txtMouseOver = new PIXI.Text("Mouse over icons to see price information.", style);
        this.txtMouseOver.x = 268;
        this.txtMouseOver.y = 480;
        this.addChild(this.txtMouseOver);

        this.coin = new PIXI.Sprite(PIXI.Texture.fromFrame("silverCoin.png"));
        this.coin.x = 127 - this.coin.width/2;
        this.coin.y = 499 - this.coin.height/2;
        this.addChild(this.coin);

        var stylec = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 22,
            fill: 'white'
        });
        this.txtPrice = new PIXI.Text("0", stylec);
        this.txtPrice.x = this.coin.x + this.coin.width + 20;
        this.txtPrice.y = 480;
        this.addChild(this.txtPrice);

        this.pageDown = new Button(PIXI.Texture.fromFrame("uiArrow.png"));
        this.pageDown.x = 696;
        this.pageDown.y = 463;
        this.addChild(this.pageDown);
        this.pageDown.on('click',this.onPageDown);

        this.pageUp = new Button(PIXI.Texture.fromFrame("uiArrow.png"));
        this.pageUp.rotation = Math.PI; // 180 degrees
        this.pageUp.x = 696;
        this.pageUp.y = 103;
        this.addChild(this.pageUp);
        this.pageUp.on('click', this.onPageUp);
    }

    onPageDown = () =>
    {
        this.pageIndex += 8;
        if (this.pageIndex > 55)
            this.pageIndex -= 8;
        this.displayPage();
    }

    onPageUp = () =>
    {
        this.pageIndex -= 8;
        if (this.pageIndex < 0)
            this.pageIndex = 0;
        this.displayPage();
    }

    private displayPage()
    {
        // display 8 market items from pageIndex member, hide all others
        var i,k,m;
        for (i=0;i<this.marketItems.length;i++)
        {
            m = this.marketItems[i];
            if (i >= this.pageIndex && i <= this.pageIndex + 7)
            {  
                k = i - this.pageIndex;
                console.log("i:" + i + " k:"+ k + " index: " + this.pageIndex);
                m.x = 113;
                m.y = 94 + (k * (m.height + 5));
                m.visible = true;
            } else {
                m.visible = false;
            }
        }
    }

    private getMarketData()
    {
        // check on the singleton, if not there generate it
        var town = SingletonClass.currentPort;
        var data = SingletonClass.getPortMarketData(town);

        return data;
    }

    itemOver = (e:any) =>
    {
        var item = <MarketItem>e.target;
        //console.log(e);
        if (item)
        {
            this.txtMouseOver.text = item.getName();
            this.txtPrice.text = item.getPrice().toString();
        }
    }
}