//
// the main HUD, overlays theSea
//

import * as PIXI from 'pixi.js';
import sailTrim from './sailtrim';
import CompassRose from './compassrose';
import Watch from './watch';
import Ship from './ship';

export default class MainHUD 
{
    private container:PIXI.Container = new PIXI.Container();

    private header:PIXI.Sprite; // background for header
    private footer:PIXI.Sprite; // background for footer

    private compassRose:CompassRose;
    private rightCannonBattery:PIXI.Sprite;
    private leftCannonBattery:PIXI.Sprite;
    private _sailTrim:sailTrim;

    private watch:Watch;

    private trackShip:Ship; // the ship the hud is currently tracking

    private didGrounding:boolean = false;
    

    // request the assets we need loaded
    public addLoaderAssets()
    {
        PIXI.loader.add("./images/ui/pottw5ui.json");
    }

    // assets are loaded, initialize sprites etc
    public onAssetsLoaded()
    {
        console.log(PIXI.loader.resources);

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

        this.watch = new Watch();
        this.watch.init();

        this.watch.x = this.compassRose.x - this.watch.width/2;
        this.watch.y = this.compassRose.y - this.compassRose.height/2 - this.watch.height - 5;

        this.container.addChild(this.header);
        this.container.addChild(this.footer);
        this.container.addChild(this.rightCannonBattery);
        this.container.addChild(this.leftCannonBattery);
        this.container.addChild(this.compassRose);
        this.container.addChild(this._sailTrim);
        this.container.addChild(this.watch);

        this.watch.visible = false;

        window.addEventListener("boatSelected", this.boatSelectedHandler, false);
        window.addEventListener("changeHeading", this.changeHeadingHandler, false);
    }

    public getContainer()
    {
        return this.container;
    }

    changeHeadingHandler = (event:any) => {
        console.log("changeHeadingHandler received!");
        // ask the boat to change to new heading, it will return how much time this take
        var newHeading = event.detail;
        let headingTime = this.trackShip.changeHeading(newHeading);
        // display a watch over the compass set to countdown by this time (milliseconds)
        this.watch.visible = true;
        this.watch.countDown(headingTime);
        this.watch.start(this.onCountDone);
    }

    onCountDone = () => {
        this.watch.visible = false;
        console.log("onCountDone!");
    }

    boatSelectedHandler = (event:any) => {
        // event.detail the reference to the tracked ship
        var newShip:Ship = event.detail;
        this.compassRose.trackShip(newShip);
        this.trackShip = newShip;
    }

    public update()
    {
        this.compassRose.update();
        this.watch.update();

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
    }
} 