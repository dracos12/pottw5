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
import Button from './button';
import popTownInterface from './poptowninterface';
import EconomyItem from './economyitem';
import SingletonClass from './singleton';
import popMsgBox from './popmsgbox';
import theSea from './theSea';
import BannerToolTip from './bannertooltip';
import { Point } from 'pixi.js';

declare var TweenMax:any;
declare var FB:any;

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
    private portWatch:Watch;
    private starWatch:Watch;

    private trackShip:Ship; // the ship the hud is currently tracking

    private didGrounding:boolean = false;

    private uiLayer:PIXI.Container;
    private lootAvail:Array<EconomyIcon>=[];

    private silverCoins:Array<PIXI.Sprite>=[];
    private goldCoins:Array<PIXI.Sprite>=[];
    private coinNum:number = 0;
    private streamCoinEffect:boolean = false;
    private streamGold:boolean = false;
    private coinInc:number = 1;
    private lastCoinTime:number = 0;
    private coinCount:number = 0;
    private coinMax:number = 0;
    private coinDelta:number = 100; // every 100ms by default
    private coinPos:PIXI.Point = new PIXI.Point(0,0);

    private txtSilverCoins:PIXI.Text;
    private txtGoldCoins:PIXI.Text;

    private shipWidget:ShipWidget;
    private targetWidget:ShipWidget;
    private popupManager:PopupManager;

    private economyLoaded:boolean = false;

    private btnAnchor:Button; // the anchor button for putting in to port
    private ammoCount:PIXI.Sprite; // background for ammo count
    private ammoNum:PIXI.Text;     // the number of rounds from the tracked ship object

    private fade2Black:PIXI.Graphics; // full screen fade out
    private timerID:number;     // ID used to clearInterval

    private sea:theSea;         // reference to theSea

    private bannerToolTip:BannerToolTip;

    // request the assets we need loaded
    public addLoaderAssets()
    {
        PIXI.loader.add("./images/ui/pottw5ui.json")
                   .add("images/2yYayZk.png")
                   .add("images/F8HIZMZFF22CHDE.MEDIUM.jpg")
                   .add("./images/ui/economy_icons.json")
                   .add("./images/ui/pottwcharacters.json");
        this.loadJSON("./data/economydata.json", this.onEconomyLoaded);
        
    }
        
    private onEconomyLoaded = (responseText:string) => 
    {
        var json_data = JSON.parse(responseText);
        //console.log(json_data);
        this.economyLoaded = true;
        // save the data to the economyicon static
        EconomyItem.setEconomyData(json_data);
    }

    // assets are loaded, initialize sprites etc
    public onAssetsLoaded()
    {
        // create 100 coin sprites for loot effect
        var i;
        for (i = 0; i<50; i++) {
            this.silverCoins[i] = new PIXI.Sprite(PIXI.Texture.fromFrame("silverCoin.png"));
            this.silverCoins[i].anchor.x = this.silverCoins[i].anchor.y = 0.5;
        }
        // create 100 coin sprites for loot effect
        for (i = 0; i<50; i++) {
            this.goldCoins[i] = new PIXI.Sprite(PIXI.Texture.fromFrame("goldCoin.png"));
            this.goldCoins[i].anchor.x = this.goldCoins[i].anchor.y = 0.5;
        }

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

        // this.lootWatch = new Watch();
        // this.lootWatch.init();

        this.portWatch = new Watch();
        this.portWatch.init();
        this.portWatch.x = this.leftCannonBattery.x - this.leftCannonBattery.width / 2 - this.portWatch.width / 2;
        this.portWatch.y = this.leftCannonBattery.y + this.leftCannonBattery.height / 2 - this.portWatch.height / 2;

        this.starWatch = new Watch();
        this.starWatch.init();
        this.starWatch.x = this.rightCannonBattery.x + this.rightCannonBattery.width / 2 - this.starWatch.width / 2;
        this.starWatch.y = this.rightCannonBattery.y + this.rightCannonBattery.height / 2 - this.starWatch.height / 2;

        this.headingWatch.x = this.compassRose.x - this.headingWatch.width/2;
        this.headingWatch.y = this.compassRose.y - this.compassRose.height/2 - this.headingWatch.height - 5;

        this.shipWidget = new ShipWidget();
        this.shipWidget.init();
        this.shipWidget.x = 20;
        this.shipWidget.y = this.footer.y + 10;
        this.shipWidget.scale.x = this.shipWidget.scale.y = 0.8;
        this.shipWidget.interactive = true;
        this.shipWidget.on('click', this.doShipDetail);

        this.targetWidget = new ShipWidget();
        this.targetWidget.init();
        this.targetWidget.x = 10;
        this.targetWidget.y = 50;
        this.targetWidget.scale.x = this.targetWidget.scale.y = 0.5;

        this.btnAnchor = new Button(PIXI.Texture.fromFrame("AnchorButton.png"));
        this.btnAnchor.x = this.footer.x + 713;
        this.btnAnchor.y = this.footer.y - 20;
        this.btnAnchor.on('click', this.doTownInterface);

        this.ammoCount = new PIXI.Sprite(PIXI.Texture.fromFrame("ammoCount.png"));
        this.ammoCount.x = this.footer.x + 559;
        this.ammoCount.y = this.footer.y + 80;

        this.bannerToolTip = new BannerToolTip();
        this.bannerToolTip.init("Shaman Island");

        this.container.addChild(this.header);
        this.container.addChild(this.footer);
        this.container.addChild(this.rightCannonBattery);
        this.container.addChild(this.leftCannonBattery);
        this.container.addChild(this.ammoCount); // behind compass and sail trim
        this.container.addChild(this.compassRose);
        this.container.addChild(this._sailTrim);
        this.container.addChild(this.headingWatch);
        this.container.addChild(this.shipWidget);
        this.container.addChild(this.btnAnchor);
        this.container.addChild(this.portWatch);
        this.container.addChild(this.starWatch);

        this.initHeader();

        this.headingWatch.visible = false;
        this.portWatch.visible = false;
        this.starWatch.visible = false;

        window.addEventListener("boatSelected", this.boatSelectedHandler, false);
        window.addEventListener("changeHeading", this.changeHeadingHandler, false);
        window.addEventListener("wreckMouseDown", this.lootMouseDown, false);
        window.addEventListener("floatingIconClick", this.collectLoot, false);
        window.addEventListener("lootDone", this.lootDone, false);
        window.addEventListener("merchSell",this.merchSell, false);
        window.addEventListener("buyGold",this.buyGold, false);
        window.addEventListener("playerWrecked", this.playerWrecked, false);
        window.addEventListener("mouseOverIsle", this.mouseOverIsle, false);
        window.addEventListener("mouseOutIsle", this.mouseOutIsle, false);
        window.addEventListener("aiShipMouseDown", this.aiShipMouseDown, false);
        window.addEventListener("clearTarget", this.clearTarget, false);

        this.testAPI(); // test the FB API
    }

    public setPopupManager(popman:PopupManager)
    {
        this.popupManager = popman;
    }

    private doShipDetail = () =>
    {
        if (this.shipWidget.isSelected())
        {
            console.log("doShipDetail");
            // display the ship detail popup
            var pop =  new popShipDetails(this.trackShip);
            this.popupManager.displayPopup(pop);
        }
        else
        {
            this.shipWidget.select(true,3000);
            // center on player ship and make widget selected
            this.centerOnPlayer();
            this.sea.selectPlayer();
            // start timer to remove it after 3 seconds
            setTimeout(this.deselect, 3000);
        }
    }

    clearTarget = () => {
        this.container.removeChild(this.targetWidget);
    }

    deselect = () => {
        this.sea.deselectPlayer();
    }

    private centerOnPlayer()
    {
        // instead call center on pt
        var centerHud = new PIXI.Point(this.container.width/2, this.container.height/2);
        var centerHudGlobal = this.container.toGlobal(centerHud);
        var seaCoord = this.sea.getContainer().toLocal(centerHudGlobal);
        var boatRef = this.trackShip.getRefPtVictor();
        var diffX = boatRef.x - seaCoord.x;
        var diffY = boatRef.y - seaCoord.y;

        var c = this.sea.getContainer();
        c.x -= diffX * c.scale.x;
        c.y -= diffY * c.scale.y;
    }

    private doTownInterface = () =>
    {
        console.log("doTownInterface");

        //display the town interface popup
        var pop =  new popTownInterface();
        pop.setPopupManager(this.popupManager);
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

        this.txtGoldCoins = new PIXI.Text('0', style);
        this.txtGoldCoins.x = 555;
        this.txtGoldCoins.y = 10;
        
        this.container.addChild(this.txtSilverCoins);
        this.container.addChild(this.txtGoldCoins);

        // also add ammo count to the footer
        this.ammoNum = new PIXI.Text('0', style);
        this.ammoNum.x = this.ammoCount.x + this.ammoCount.width / 2 - this.ammoNum.width / 2;
        this.ammoNum.y = this.ammoCount.y + this.ammoCount.height / 2 - this.ammoNum.height / 2;
        this.container.addChild(this.ammoNum);
    }

    public getContainer()
    {
        return this.container;
    }

    public setSeaUILayer(layer:PIXI.Container)
    {
        this.uiLayer = layer;
    }

    public setTheSea(sea:theSea)
    {
        this.sea = sea;
    }

    fireRight = (event:any) => {
        var time;
        time = this.trackShip.fireCannons(true);
        if (time != 0)
        {
            // display starboard reload timer
            this.starWatch.visible = true;
            this.starWatch.countDown(time);
            this.starWatch.start(this.onRightReloadDone); 
        }
    }

    onRightReloadDone = () => {
        this.starWatch.visible = false;
    }

    fireLeft = (event:any) => {
        var time;
        time  = this.trackShip.fireCannons(false);
        if (time != 0)
        {
            // display starboard reload timer
            this.portWatch.visible = true;
            this.portWatch.countDown(time);
            this.portWatch.start(this.onLeftReloadDone); 
        }
    }

    onLeftReloadDone = () => { 
        this.portWatch.visible = false;
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

    playerWrecked = (event:any) => {
        console.log("Player Wrecked, strating recovery");
        // start the player recovery process
        this.playerRecovery();
    }

    boatSelectedHandler = (event:any) => {
        // event.detail the reference to the tracked ship
        var newShip:Ship = event.detail;
        this.compassRose.trackShip(newShip);
        this.trackShip = newShip;
        var s = SingletonClass.getInstance(); 
        s.SetShip(this.trackShip);
        this.shipWidget.setShip(this.trackShip);
    }

    buyGold = (e:any) =>
    {
        var amount = e.detail.amount; // detail contains just the coint count
        var x = e.detail.x;
        var y = e.detail.y;
        var inc = e.detail.inc;
        var refPt = new PIXI.Point(x,y); // message has sent up global pos x,y
        var locPos = this.container.toLocal(refPt);
        this.streamCoins(amount,locPos.x,locPos.y,true,inc);       
    }

    merchSell = (e:any) => {
        var amount = e.detail.amount; // detail contains just the coint count
        var x = e.detail.x;
        var y = e.detail.y;
        var refPt = new PIXI.Point(x,y); // message has sent up global pos x,y
        var locPos = this.container.toLocal(refPt);
        this.streamCoins(amount,locPos.x,locPos.y);
    }

    aiShipMouseDown = (e:any) => {
        // mouse down on non-wrecked ai boat... display target widget
        var boat:Ship = e.detail;
        this.container.addChild(this.targetWidget);
        this.targetWidget.setShip(boat);
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
            var coins = boat.getCoins();
            this.streamCoins(coins,locPos.x,locPos.y);
            boat.sink();
            return; // dont pop any more
        }
        var item = boat.aiPopNextLoot();
        if (item == null)
        {
            console.log("Error: aiPopNextLoot returned no value");
            return;
        }
        var s = boat.getSprite();
        // rand loot
        var icon = new EconomyIcon(item.type,this.lootAvail.length,true,item.rarity);
        var ref = boat.getRefPt();
        icon.x = s.x + ref.x;
        icon.y = s.y + ref.y;
        icon.throwOutAndBob();
        this.uiLayer.addChild(icon);
        this.lootAvail.push(icon);
        
    }

    collectLoot = (e:any) => {
        // mouse up over wreck, stop the loot action (even if not done)
        //console.log("collect loot!");
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

    mouseOverIsle = (e:any) => {
        var isleInfo = e.detail;
        var seaPos = new PIXI.Point(isleInfo.x, isleInfo.y);
        var globalSeaPos = this.sea.getContainer().toGlobal(seaPos);
        var localSeaPos = this.container.toLocal(globalSeaPos);
        var scale = this.sea.getWheelScale();
        if (scale < 0.5)
            scale = 0.75;
        else
            scale = 1;
        this.bannerToolTip.scale.x = this.bannerToolTip.scale.y = scale;
        this.bannerToolTip.x = localSeaPos.x;
        this.bannerToolTip.y = localSeaPos.y;
        this.bannerToolTip.changeLabel(isleInfo.isleName);
        this.bannerToolTip.changePortFlag(isleInfo.portFlag);
        this.bannerToolTip.changeNatFlag(isleInfo.natFlag);
        this.container.addChild(this.bannerToolTip);
    }

    mouseOutIsle = (e:any) => {
        var isleName = e.detail;
        this.container.removeChild(this.bannerToolTip);
    }

    private playerRecovery()
    {
        var w = window.innerWidth;
        var h = window.innerWidth;
        // add a full screen view blocker and start the animation to fade to black
        this.fade2Black = new PIXI.Graphics();
        this.fade2Black.beginFill(0x000001);
        this.fade2Black.drawRect(0,0,w,h);
        this.fade2Black.endFill();
        this.fade2Black.alpha = 0.02;
        this.container.parent.addChild(this.fade2Black);
        // start timer to fade it out over 5 seconds
        this.timerID = setInterval(this.fadeOut, 100);
    }

    fadeOut = () => {
        this.fade2Black.alpha += 0.02;
        if (this.fade2Black.alpha >= 1.0)
        {
            // move player ship to port
            // remove its wrecked status
            // empty hold
            // tell the sea to focus on the player ship
            // fade back up

            // for now end interval
            clearInterval(this.timerID);
            this.timerID = setInterval(this.fadeIn, 100);
            SingletonClass.ship.unWreck();
            this.sea.clearPlayerTarget();
            this.centerOnPlayer();
        }
    }

    fadeIn = () => {
        this.fade2Black.alpha -= 0.05;
        if (this.fade2Black.alpha <= 0)
        {
            clearInterval(this.timerID);
            this.container.parent.removeChild(this.fade2Black);
        }
    }

    private streamCoins(numCoins:number,x:number,y:number,gold:boolean=false,inc:number=1)
    {
        // stream coins to the hud every tick
        this.streamCoinEffect = true;
        this.coinCount = 0;
        this.coinMax += numCoins;
        this.coinDelta = 1000 / (40 / 3) ;
        this.coinPos.x = x;
        this.coinPos.y = y;
        this.streamGold = gold;
        this.coinInc = inc;
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

    private testAPI() 
    {
        console.log("call FB.getLoginStatus:");
        FB.getLoginStatus(this.fbStatusResponse);
    }

    fbStatusResponse = (response:any) => {
        console.log("response FB.getLoginStatus:");
        console.log(response);
        if (response.status == "connected")
        {
            // save access token and userid
            SingletonClass.player.FBUserID = response.authResponse.userID;
            SingletonClass.player.FBAccessToken = response.authResponse.accessToken;
            this.doMe();
        }
        else
        {
            console.log("FB.login() due to : " + response.status);
            FB.login(function(response:any) {
                if (response.authResponse) {
                    console.log(response.authResponse);
                    SingletonClass.player.FBUserID = response.authResponse.userID;
                    SingletonClass.player.FBAccessToken = response.authResponse.accessToken;
                    this.doMe();
                } else {
                    console.log('User cancelled login or did not fully authorize.');
                }
            }, {
                scope: 'email', 
                return_scopes: true
            });
        }
    }

    private doMe()
    {
        console.log("FB.api(/me)");
        FB.api('/me', { locale: 'en_US', fields: 'id, name, email' }, function(response:any) {
            console.log(response);
            SingletonClass.player.userEmail = response.email;
            SingletonClass.player.userName = response.name;
        });
    }

    public update()
    {
        var now = Date.now();
        
        if (this.streamCoinEffect)
        {
            if (now - this.lastCoinTime > this.coinDelta)
            {
                this.coinCount++;
                if (this.coinCount >= this.coinMax)
                {
                    this.streamCoinEffect = false;
                    this.coinMax = 0;
                }
                this.lastCoinTime = now;
                if (!this.streamGold)
                    this.container.addChild(this.silverCoins[this.coinNum]);
                else    
                    this.container.addChild(this.goldCoins[this.coinNum]);
                var ox,oy,x1,y1,x2,y2,fx,fy;
                ox = this.coinPos.x;
                oy = this.coinPos.y;
                x1 = 0;
                y1 = this.container.height * 0.75;
                x2 = this.container.width;
                y2 = this.container.height * 0.25;
                if (!this.streamGold) {
                    fx = this.header.x + 636;
                    fy = this.header.y + 23;
                } else {
                    fx = this.header.x + 534;
                    fy = this.header.y + 23;
                }
                let coin = this.coinNum;
                if (!this.streamGold) {
                    this.silverCoins[this.coinNum].x = ox; 
                    this.silverCoins[this.coinNum].y = oy;
                } else {
                    this.goldCoins[this.coinNum].x = ox; 
                    this.goldCoins[this.coinNum].y = oy;
                }
                if (!this.streamGold) {
                TweenMax.to(this.silverCoins[this.coinNum], 1.75,
                            {bezier: {type:"soft", curviness:2.0,values:[{x:ox,y:oy},{x:x1,y:y1},{x:x2,y:y2},{x:fx,y:fy}]},
                             onComplete: () => {this.container.removeChild(this.silverCoins[coin]); SingletonClass.player.incSilver(1);} }
                            ); 
                } else {
                TweenMax.to(this.goldCoins[this.coinNum], 1.75,
                    {bezier: {type:"soft", curviness:2.0,values:[{x:ox,y:oy},{x:x1,y:y1},{x:x2,y:y2},{x:fx,y:fy}]},
                        onComplete: () => { this.container.removeChild(this.goldCoins[coin]); SingletonClass.player.incGold(this.coinInc); } }
                    );                    
                }
                this.coinNum++;
                if (this.coinNum >= this.silverCoins.length)
                    this.coinNum = 0;
            }
        }

        if (SingletonClass.player.getSilver().toString() != this.txtSilverCoins.text)
            this.txtSilverCoins.text = SingletonClass.player.getSilver().toFixed(0).toString();

        if (SingletonClass.player.getGold().toString() != this.txtGoldCoins.text)
            this.txtGoldCoins.text = SingletonClass.player.getGold().toString();

        this.ammoNum.text = this.trackShip.getMagBall().toString();
        this.ammoNum.x = this.ammoCount.x + this.ammoCount.width / 2 - this.ammoNum.width / 2;
        this.ammoNum.y = this.ammoCount.y + this.ammoCount.height / 2 - this.ammoNum.height / 2;

        this.compassRose.update();
        this.headingWatch.update();
        this.starWatch.update();
        this.portWatch.update();
        this._sailTrim.update();
        this.shipWidget.update();
        this.targetWidget.update();
        this.bannerToolTip.update();

        if (this.trackShip.isAground() || this.trackShip.isWrecked())
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

        if (SingletonClass.currentPort != "")
            this.btnAnchor.visible = true;
        else
            this.btnAnchor.visible = false;
        
    }
} 