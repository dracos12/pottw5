//
// the main HUD, overlays theSea
//

import * as PIXI from 'pixi.js';
import sailTrim from './sailtrim';
import CompassRose from './compassrose';

export default class MainHUD 
{
    private container:PIXI.Container = new PIXI.Container();

    private header:PIXI.Sprite; // background for header
    private footer:PIXI.Sprite; // background for footer

    private compassRose:CompassRose;
    private rightCannonBattery:PIXI.Sprite;
    private leftCannonBattery:PIXI.Sprite;
    private _sailTrim:sailTrim;

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
        this.compassRose.scale.x = 0.33;
        this.compassRose.scale.y = 0.33;
        this.compassRose.x = this._sailTrim.x - this.compassRose.width;
        this.compassRose.y = window.innerHeight - this.compassRose.height;

        this.leftCannonBattery = new PIXI.Sprite(PIXI.Texture.fromFrame("CannonArray.png"));
        this.leftCannonBattery.x = this.compassRose.x; // scaleX will be flipped which makes its anchor point top right
        this.leftCannonBattery.y = this.footer.y;
        this.leftCannonBattery.scale.x = -1; // flip the art so it points left

        this.container.addChild(this.header);
        this.container.addChild(this.footer);
        this.container.addChild(this.rightCannonBattery);
        this.container.addChild(this.leftCannonBattery);
        this.container.addChild(this.compassRose);
        this.container.addChild(this._sailTrim);
    }

    public getContainer()
    {
        return this.container;
    }

    public update()
    {
        this.compassRose.update();
    }
} 