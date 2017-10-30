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
    

    // request the assets we need loaded
    public addLoaderAssets()
    {
        PIXI.loader.add("./images/ui/pottw5ui.json")
                   .add("images/2yYayZk.png")
                   .add("images/F8HIZMZFF22CHDE.MEDIUM.jpg")
                   .add("./images/ui/economy_icons.json");
    }

    // assets are loaded, initialize sprites etc
    public onAssetsLoaded()
    {
        //console.log(PIXI.loader.resources);

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

        this.container.addChild(this.header);
        this.container.addChild(this.footer);
        this.container.addChild(this.rightCannonBattery);
        this.container.addChild(this.leftCannonBattery);
        this.container.addChild(this.compassRose);
        this.container.addChild(this._sailTrim);
        this.container.addChild(this.headingWatch);

        this.headingWatch.visible = false;

        window.addEventListener("boatSelected", this.boatSelectedHandler, false);
        window.addEventListener("changeHeading", this.changeHeadingHandler, false);
        window.addEventListener("wreckMouseDown", this.lootMouseDown, false);
        window.addEventListener("wreckMouseUp", this.lootMouseUp, false);
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
        var s = boat.getSprite();
        // var globalP = s.getGlobalPosition();
        // var localP = this.container.toLocal(globalP);
        var icon = new EconomyIcon(EcoType.BARREL);
        var ref = boat.getRefPt();
        icon.x = s.x + ref.x;
        icon.y = s.y + ref.y;
        icon.throwOutAndBob();
        this.uiLayer.addChild(icon);
    }

    lootMouseUp = (e:any) => {
        // mouse up over wreck, stop the loot action (even if not done)
        console.log("End Loot click");
    }

    public update()
    {
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