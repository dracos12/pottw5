import * as PIXI from 'pixi.js';
import theSea from './theSea';
import MainHUD from './mainhud';

import PopupManager from './popupmanager';
import SingletonClass from './singleton';

export default class Core {
    private _renderer:PIXI.CanvasRenderer|PIXI.WebGLRenderer;
    private _world:PIXI.Container;
    private _sea:theSea;
    private _hud:MainHUD;
    private _popupManager:PopupManager;

    private seaLoaded:boolean = false;
    private hudLoaded:boolean = false;

    constructor() {
        this._renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight,{backgroundColor: 0x7BA4DF});
        this._world = new PIXI.Container();
        document.body.appendChild(this._renderer.view);

        // create a new sea object
        this._sea = new theSea();
        this._sea.init(this.seaLoadedCallback);

        // create the main hud
        this._hud = new MainHUD();
        this._hud.addLoaderAssets(); 
        this._hud.setTheSea(this._sea);

        // create popupmanager
        this._popupManager = new PopupManager();
        this._popupManager.setContainer(this._hud.getContainer());
        this._hud.setPopupManager(this._popupManager);
        SingletonClass.popupManager = this._popupManager;

        // load all the assets requested by theSea and Hud
        PIXI.loader.load(this.onLoaded);

        console.log("PotTW: build 0.0.14");
    }

    private onLoaded = () => 
    {
        // hud is done and needs no further loading
        this.mainHUDLoaded();
        // theSea needs to load its data files
        this._sea.setup();

        // the sea will call seaLoadedCallback when its finally done so we can proceed
    }

    private postLoad()
    {
        if (this.hudLoaded && this.seaLoaded)
        {
            this._world.addChild(this._sea.getContainer());
            this._world.addChild(this._hud.getContainer());

            // center hud on window size
            let c = this._hud.getContainer();
            c.x = (window.innerWidth - c.width) / 2;

            //mousewheel not part of Pixi so add the event to the DOM
            document.body.addEventListener("wheel", this._sea.mouseWheelHandler, false);

            this._hud.setSeaUILayer(this._sea.getUILayer());

            this.update();
        }
    }

    private mainHUDLoaded = () =>
    {
        let c = this._hud.getContainer();
        c.x = 0;
        c.y = 0;

        this.hudLoaded = true;
        this._hud.onAssetsLoaded();

        this.postLoad();
    }

    private seaLoadedCallback = () =>
    {
        this.seaLoaded = true;

        this.postLoad();
    }

    public update = () => 
    {
        this._sea.update();
        this._hud.update();

        this._renderer.render(this._world);

        requestAnimationFrame(this.update);
    }

}

let game = new Core();
