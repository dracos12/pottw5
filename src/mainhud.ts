//
// the main HUD, overlays theSea
//

import * as PIXI from 'pixi.js';
import sailTrim from './sailtrim';
import CompassRose from './compassrose';
import Watch from './watch';
import Ship from './ship';
import EconomyIcon from './economyicon';
import { EcoType } from './economyicon';
import Player from './player';
import ShipWidget from './shipwidget';
import PopupManager from './popupmanager';
import popShipDetails from './popshipdetail';

declare var TweenMax:any;

export default class MainHUD 
{
    private container:PIXI.Container = new PIXI.Container();

    private header:PIXI.Sprite; // background for header
    private footer:PIXI.Sprite; // background for footer

    private compassRose:CompassRose;
    private rightCannonBattery:PIXI.Sprite;
    private leftCannonBattery:PIXI.Sprite;
    private _sailTrim:sailTrim;

    private headingWatch:Watch;
    private lootWatch:Watch;

    private trackShip:Ship; // the ship the hud is currently tracking

    private didGrounding:boolean = false;

    private uiLayer:PIXI.Container;
    private lootAvail:Array<EconomyIcon>=[];

    private silverCoins:Array<PIXI.Sprite>=[];
    private coinNum:number = 0;
    private streamCoinEffect:boolean = false;
    private lastCoinTime:number = 0;
    private coinCount:number = 0;
    private coinMax:number = 0;
    private coinDelta:number = 100; // every 100ms by default
    private coinPos:PIXI.Point = new PIXI.Point(0,0);

    private txtSilverCoins:PIXI.Text;
    private player:Player;  // the player object, stores all player data

    private shipWidget:ShipWidget;
    private popupManager:PopupManager;

    private economyLoaded:boolean = false;

    // request the assets we need loaded
    public addLoaderAssets()
    {
        PIXI.loader.add("./images/ui/pottw5ui.json")
                   .add("images/2yYayZk.png")
                   .add("images/F8HIZMZFF22CHDE.MEDIUM.jpg")
                   .add("./images/ui/economy_icons.json");
        this.player = new Player();
        this.loadJSON("./data/economydata.json", this.onEconomyLoaded);
        
    }
        
    private onEconomyLoaded = (responseText:string) => 
    {
        var json_data = JSON.parse(responseText);
        //console.log(json_data);
        this.economyLoaded = true;
        // save the data to the economyicon static
        EconomyIcon.setEconomyData(json_data);
    }

    // assets are loaded, initialize sprites etc
    public onAssetsLoaded()
    {
        // create 100 coin sprites for loot effect
        for (var i = 0; i<100; i++)
            this.silverCoins[i] = new PIXI.Sprite(PIXI.Texture.fromFrame("silverCoin.png"));

        // create and place the header
        this.header = new PIXI.Sprite(PIXI.Texture.fromFrame("UI_Header.png"));
        this.header.x = 0;
        this.header.y = 0;

        // create and place the footer
        this.footer = new PIXI.Sprite(PIXI.Texture.fromFrame("UIFooter.png"));
        this.footer.x = 0;
        this.footer.y = window.innerHeight - this.footer.height;

        this.rightCannonBattery = new PIXI.Sprite(PIXI.Texture.fromFrame("CannonArray.png"));
        this.rightCannonBattery.x = this.footer.width - this.rightCannonBattery.width + 40;
        this.rightCannonBattery.y = this.footer.y;
        this.rightCannonBattery.interactive = true;
        this.rightCannonBattery.on("click", this.fireRight);

        // sail trim nbext to guns
        this._sailTrim = new sailTrim();
        this._sailTrim.init();
        this._sailTrim.scale.x = this._sailTrim.scale.y = 0.67;
        this._sailTrim.x = this.rightCannonBattery.x - this._sailTrim.width + 20;
        this._sailTrim.y = window.innerHeight - this._sailTrim.height;

        this.compassRose = new CompassRose();
        this.compassRose.init();
        // pivot set by compassrose to be center of itself
        this.compassRose.x = this._sailTrim.x - this.compassRose.width/2;
        this.compassRose.y = window.innerHeight - this.compassRose.height/2;

        this.leftCannonBattery = new PIXI.Sprite(PIXI.Texture.fromFrame("CannonArray.png"));
        this.leftCannonBattery.x = this.compassRose.x - this.compassRose.width/2; // scaleX will be flipped which makes its anchor point top right
        this.leftCannonBattery.y = this.footer.y;
        this.leftCannonBattery.scale.x = -1; // flip the art so it points left
        this.leftCannonBattery.interactive = true;
        this.leftCannonBattery.on("click", this.fireLeft);

        this.headingWatch = new Watch();
        this.headingWatch.init();

        this.lootWatch = new Watch();
        this.lootWatch.init();

        this.headingWatch.x = this.compassRose.x - this.headingWatch.width/2;
        this.headingWatch.y = this.compassRose.y - this.compassRose.height/2 - this.headingWatch.height - 5;

        this.shipWidget = new ShipWidget();
        this.shipWidget.init();
        this.shipWidget.x = 20;
        this.shipWidget.y = this.footer.y + 10;
        this.shipWidget.scale.x = this.shipWidget.scale.y = 0.8;
        this.shipWidget.interactive = true;
        this.shipWidget.on('click', this.doShipDetail);

        this.container.addChild(this.header);
        this.container.addChild(this.footer);
        this.container.addChild(this.rightCannonBattery);
        this.container.addChild(this.leftCannonBattery);
        this.container.addChild(this.compassRose);
        this.container.addChild(this._sailTrim);
        this.container.addChild(this.headingWatch);
        this.container.addChild(this.shipWidget);

        this.initHeader();

        this.headingWatch.visible = false;

        window.addEventListener("boatSelected", this.boatSelectedHandler, false);
        window.addEventListener("changeHeading", this.changeHeadingHandler, false);
        window.addEventListener("wreckMouseDown", this.lootMouseDown, false);
        window.addEventListener("wreckMouseUp", this.lootMouseUp, false);
        window.addEventListener("floatingIconClick", this.collectLoot, false);
        window.addEventListener("lootDone", this.lootDone, false);

    }

    public setPopupManager(popman:PopupManager)
    {
        this.popupManager = popman;
    }

    private doShipDetail = () =>
    {
        console.log("doShipDetail");
        // display the ship detail popup
        var pop =  new popShipDetails(this.trackShip);
        this.popupManager.displayPopup(pop);
    }

    private initHeader()
    {
        var style = new PIXI.TextStyle({
            fontFamily: 'IM Fell English SC',
            fontSize: 16,
            fill: 'white'
        });
        
        this.txtSilverCoins = new PIXI.Text('0', style);
        this.txtSilverCoins.x = 654;
        this.txtSilverCoins.y = 10;
        
        this.container.addChild(this.txtSilverCoins);
    }

    public getContainer()
    {
        return this.container;
    }

    public setSeaUILayer(layer:PIXI.Container)
    {
        this.uiLayer = layer;
    }

    fireRight = (event:any) => {
        this.trackShip.fireCannons(true);
    }

    fireLeft = (event:any) => {
        this.trackShip.fireCannons(false);
    }

    changeHeadingHandler = (event:any) => {
        //console.log("changeHeadingHandler received!");
        // ask the boat to change to new heading, it will return how much time this take
        var newHeading = event.detail;
        let headingTime = this.trackShip.changeHeading(newHeading);
        // display a watch over the compass set to countdown by this time (milliseconds)
        this.headingWatch.visible = true;
        this.headingWatch.countDown(headingTime);
        this.headingWatch.start(this.onCountDone);
    }

    onCountDone = () => {
        this.headingWatch.visible = false;
        //console.log("onCountDone!");
    }

    boatSelectedHandler = (event:any) => {
        // event.detail the reference to the tracked ship
        var newShip:Ship = event.detail;
        this.compassRose.trackShip(newShip);
        this.trackShip = newShip;
    }

    lootMouseDown = (e:any) => {
        // mouse down on a wreck icon, show the loot watch and popout a loot icon one per second
        var boat:Ship = e.detail.boat;
        var loots = e.detail.holdLength;
        console.log("Clicked wreck to get: " + boat.aiNumHoldItems() + " items");
        if (boat.aiNumHoldItems() == 0)
        {
            // stream some coins to the HUD when out of loot items
            var x,y;
            x = boat.getSprite().x + boat.getRefPt().x;
            y = boat.getSprite().y + boat.getRefPt().y;
            var refPt = new PIXI.Point(x,y);
            var pos = boat.getSprite().toGlobal(refPt);
            var locPos = this.container.toLocal(boat.getSprite().getGlobalPosition());
            this.streamCoins(40,locPos.x,locPos.y);
            return; // dont pop any more
        }
        var itemID = boat.aiPopNextLoot();
        var s = boat.getSprite();
        // var globalP = s.getGlobalPosition();
        // var localP = this.container.toLocal(globalP);
        // rand loot
        var icon = new EconomyIcon(itemID,this.lootAvail.length,true);
        var ref = boat.getRefPt();
        icon.x = s.x + ref.x;
        icon.y = s.y + ref.y;
        icon.throwOutAndBob();
        this.uiLayer.addChild(icon);
        this.lootAvail.push(icon);
        
    }

    lootMouseUp = (e:any) => {
        // mouse up over wreck, stop the loot action (even if not done)
        console.log("End Loot click");
    }

    collectLoot = (e:any) => {
        // mouse up over wreck, stop the loot action (even if not done)
        console.log("collect loot!");
        // get the icon from the details
        if (this.trackShip.isHoldFull())
        {
            // display first mate error message
            console.log("Captain! Our hold is full! We cant store any more!");
        }
        else
        {
            var id = e.detail;
            var targx = this.trackShip.getSprite().x + this.trackShip.getRefPt().x;
            var targy = this.trackShip.getSprite().y + this.trackShip.getRefPt().y;
            this.lootAvail[id].lootIcon(targx, targy);
        }

    }

    lootDone = (e:any) => {
        var id = e.detail;
        // give loot to the player's boat if possible
        // remove this id
        this.uiLayer.removeChild(this.lootAvail[id]);
        if(!this.trackShip.addToHold(this.lootAvail[id].getType()))
        {
            // we already checked above, not sure how it could get full between calls
            console.log("addToHold failed post-check");
        }
    }

    private streamCoins(numCoins:number,x:number,y:number)
    {
        // stream coins to the hud every tick
        this.streamCoinEffect = true;
        this.coinCount = 0;
        this.coinMax = numCoins;
        this.coinDelta = 1000 / (numCoins / 3) ;
        this.coinPos.x = x;
        this.coinPos.y = y;
    }

    private loadJSON(jsonFile:string, callback:Function) 
    {
        var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
        xobj.open('GET', jsonFile, true); 
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == 200) {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                callback(xobj.responseText);
            }
        };
        xobj.send(null);  
    }

    public update()
    {
        var now = Date.now();
        
        if (this.streamCoinEffect)
        {
            if (now - this.lastCoinTime > this.coinDelta)
            {
                this.coinCount++;
                if (this.coinCount > this.coinMax)
                    this.streamCoinEffect = false;
                this.lastCoinTime = now;
                this.container.addChild(this.silverCoins[this.coinNum]);

                var ox,oy,x1,y1,x2,y2,fx,fy;
                ox = this.coinPos.x;
                oy = this.coinPos.y;
                x1 = 0;
                y1 = this.container.height * 0.75;
                x2 = this.container.width;
                y2 = this.container.height * 0.25;
                fx = this.container.width * 0.75;
                fy = 20;
                let coin = this.coinNum;
                this.silverCoins[this.coinNum].x = ox; 
                this.silverCoins[this.coinNum].y = oy;
                TweenMax.to(this.silverCoins[this.coinNum], 1.75,
                            {bezier: {type:"soft", curviness:2.0,values:[{x:ox,y:oy},{x:x1,y:y1},{x:x2,y:y2},{x:fx,y:fy}]},
                             onComplete: () => { this.container.removeChild(this.silverCoins[coin]); this.player.incSilver(1);} }
                            ); 
                this.coinNum++;
                if (this.coinNum >= this.silverCoins.length)
                    this.coinNum = 0;
            }
        }

        if (this.player.getSilver().toString() != this.txtSilverCoins.text)
            this.txtSilverCoins.text = this.player.getSilver().toString();

        this.compassRose.update();
        this.headingWatch.update();
        this._sailTrim.update();

        if (this.trackShip.isAground())
        {
            if (!this.didGrounding) {
                this._sailTrim.setSailTrimPercent(0);
                this.didGrounding = true;
            }
        }
        else
        {
            if (this.didGrounding)
                this.didGrounding = false;
        }

        if (!CompassRose.isValidHeading(this.trackShip.getAngleToWind(),this.trackShip.getHeading()))
        {
            this._sailTrim.showLuff();
        }
        else {
            this._sailTrim.hideLuff();
        }
    }
} 