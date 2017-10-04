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
    private cannons:PIXI.Sprite;
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

        this.cannons = new PIXI.Sprite(PIXI.Texture.fromFrame("CannonArray.png"));
        this.cannons.x = this.footer.width - this.cannons.width + 40;
        this.cannons.y = this.footer.y;

        this.compassRose = new CompassRose();
        this.compassRose.init();
        this.compassRose.scale.x = 0.67;
        this.compassRose.scale.y = 0.67;
        this.compassRose.x = this.cannons.x - this.compassRose.width + 20;
        this.compassRose.y = window.innerHeight - this.compassRose.height;

        this._sailTrim = new sailTrim();
        this._sailTrim.init();
        this._sailTrim.x = this.compassRose.x - this._sailTrim.width - 5;
        this._sailTrim.y = window.innerHeight - this._sailTrim.height;

        this.container.addChild(this.header);
        this.container.addChild(this.footer);
        this.container.addChild(this.cannons);
        this.container.addChild(this.compassRose);
        this.container.addChild(this._sailTrim);
    }

    public getContainer()
    {
        return this.container;
    }
} 