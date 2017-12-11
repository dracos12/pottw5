//
// popProvisioner class for buying selling provisions in town. This is where the player will
//                  sell the stuff in their boat hold and buy ships provisions for thier boat
//
import * as PIXI from 'pixi.js';
import PopUp from './popup';
import Button from './button';
import EconomyIcon from './economyicon';
import SingletonClass from './singleton';
import popMsgBox from './popmsgbox';


export default class popWarehouse extends PopUp
{
    private mercBack:PIXI.Sprite;
    private holdBack:PIXI.Sprite;
    private coin:PIXI.Sprite;
    private sellBtn:Button;
    private txtAmount:PIXI.Text;
    private holdIcons:Array<EconomyIcon> = [];
    private wareIcons:Array<EconomyIcon> = [];

    constructor()
    {
        super();
    }

    public init()
    {
        super.init(); // add backdrop and x buttton

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
        
       
        var lbl = new PIXI.Text('Warehouse:', style);
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

        var townName = SingletonClass.currentPort;
        lbl = new PIXI.Text(townName + ' Warehouse', style);
        lbl.x = this.mercBack.x + this.mercBack.width/2 - lbl.width / 2;
        lbl.y = 35;
        this.addChild(lbl);

        this.sellBtn = new Button(PIXI.Texture.fromFrame("sellBtn.png"));
        this.sellBtn.x = 531;
        this.sellBtn.y = 302;
        this.sellBtn.scale.x = this.sellBtn.scale.y = 0.67;
        this.sellBtn.on('click',this.onSell);
        this.addChild(this.sellBtn);

        this.coin = new PIXI.Sprite(PIXI.Texture.fromFrame("silverCoin.png"));
        this.coin.x = 329 - this.coin.width/2;
        this.coin.y = 306 - this.coin.height/2;
        this.addChild(this.coin);

        var stylec = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 22,
            fill: 'white'
        });
        this.txtAmount = new PIXI.Text('0', stylec);
        this.txtAmount.x = this.coin.x + this.coin.width + 5;
        this.txtAmount.y = this.coin.y + this.coin.height/2 - this.txtAmount.height/2;
        this.addChild(this.txtAmount);

        this.loadHold();
        this.displayWares();
    }

    private reloadHold()
    {
        // remove all icons
        var i,e;
        for (i=this.holdIcons.length-1; i>=0; i--)
        {
            e = this.holdIcons.pop();
            this.removeChild(e);
        }

        this.loadHold();
    }

    private loadHold(createIcons:boolean=true)
    {
        var hold = SingletonClass.ship.getHold();
        var e;
        for (var i=0; i<hold.length; i++)
        {
            if (createIcons)
                e = new EconomyIcon(hold[i].type, i, false,hold[i].rarity);
            else
                e = this.holdIcons[i];

            // place in our 10x4 grid
            e.x = ((i % 10) * 42) + i%10*3 + 21; // icons are center anchor
            e.y = (Math.floor(i/10) * 42) + Math.floor(i/10)*3 + 21; // adjust for center anchor
            e.x += this.holdBack.x + 10;
            e.y += this.holdBack.y + 4;

            if (createIcons)
            {
                e.interactive = true;
                e.on('click',this.iconClicked);
                this.holdIcons.push(e);
                this.addChild(e);
            }
        }
    }

    private displayWares()
    {
        // warehouse sells lowest demand items generated on the singleton
        var data = SingletonClass.getPortWarehouseData(SingletonClass.currentPort);
        var i,e;
        for (i=0;i<data.items.length;i++)
        {
            e = new EconomyIcon(data.items[i], 0, false, 0);
            e.x = ((i % 10) * 42) + i%10*3 + 21; // icons are center anchor
            e.y = (Math.floor(i/10) * 42) + Math.floor(i/10)*3 + 21; // adjust for center anchor
            e.x += this.mercBack.x + 10;
            e.y += this.mercBack.y + 4;
            this.addChild(e);
            e.interactive = true;
            e.on('click',this.wareClicked);
            this.wareIcons.push(e);
        }
        
    }

    private redisplayWares()
    {
        var i;
        for (i=0;i<this.wareIcons.length;i++)
        {

        }   
    }

    wareClicked = (e:any) =>
    {
        var eIcon = <EconomyIcon>e.target;
        console.log("wareClicked! eIcon: " + eIcon);
        var itemID = eIcon.getType();
        var price = SingletonClass.getMarketItemPrice(itemID);
        if (SingletonClass.player.getSilver() >= price)
        {
            // add the icon to their hold
            if (!SingletonClass.ship.addToHold(itemID,0))
            {
                // no room! abort
                var msg = new popMsgBox();
                msg.initMsg(0,"1st Mate", "Hold is full captain! We'll have to sell items to make room.");
                SingletonClass.popupManager.displayPopup(msg);
            }
            else
            {
                // charge the user
                SingletonClass.player.decSilver(price);
                // remove the icon from the warehouse
                var i;
                for (i=this.wareIcons.length-1; i>=0; i--)
                {
                    if (this.wareIcons[i] == eIcon)
                    {
                        this.wareIcons.splice(i,1);
                        var data = SingletonClass.getPortWarehouseData(SingletonClass.currentPort);
                        data.items.splice(i,1); // remove from the warehouse data as well
                        break;
                    }
                }
                eIcon.interactive = false;
                eIcon.parent.removeChild(eIcon);
                this.reloadHold();
            }
        } else { // not enough money!
            var msg = new popMsgBox();
            msg.initMsg(0,"1st Mate", "We dont have enough silver for that Cap'n! Price: " + price);
            SingletonClass.popupManager.displayPopup(msg);
        }
    }

    iconClicked = (e:any) => 
    {
        (<EconomyIcon>e.target).glowToggle();
        this.calculateTotalSellPrice();
    }

    private calculateTotalSellPrice()
    {
        // loop through the icons, add price from hold item for those glowing
        var i;
        var price = 0;
        var hold = SingletonClass.ship.getHold();
        for(i=0;i<this.holdIcons.length;i++)
        {
            if (this.holdIcons[i].isGlowing())
            {
                price += hold[i].getMarketPrice();
            }
        }

        // display this price in our txtlabel
        this.txtAmount.text = price.toString();
        return price;
    }

    onSell = (e:any) =>
    {
        // sell all glowing icons
        // loop over the hold backwards
        var amount = this.calculateTotalSellPrice();
        if (amount <= 0)
            return; // do nothing, nothign selected

        // and send up the request to the hud to award the coins
        var pos = this.toGlobal(this.coin.position);
        var myEvent = new CustomEvent("merchSell",
        {
            'detail': { "amount": amount, "x": pos.x +this.coin.width/2, "y":pos.y+this.coin.height/2 }
        });

        window.dispatchEvent(myEvent);
        var i;
        var hold = SingletonClass.ship.getHold();
        // loop from end as splice will change indeces if looped front to back
        for(i=this.holdIcons.length-1;i>=0;i--)
        {
            if (this.holdIcons[i].isGlowing())
            {
                this.removeChild(this.holdIcons[i]);
                this.holdIcons.splice(i,1);
                hold.splice(i,1);
            }
        }

        this.loadHold(false); // flag to just reposition existing items
        this.txtAmount.text = "0";
    }

}