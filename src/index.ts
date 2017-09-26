import * as PIXI from 'pixi.js';
import theSea from './theSea';

export default class Core {
    private _renderer:PIXI.CanvasRenderer|PIXI.WebGLRenderer;
    private _world:PIXI.Container;
    private _sea:theSea;

    constructor() {
        this._renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight,{backgroundColor: 0x7BA4DF});
        this._world = new PIXI.Container();
        document.body.appendChild(this._renderer.view);

        // create a new sea object
        this._sea = new theSea();
        this._sea.init(this.seaLoadedCallback);
    }

    private seaLoadedCallback = () =>
    {
        // add listener to the stage - stage declared in main, top level js file
        console.log("PotTW: build 0.0.11");
        this._world.interactive = true;
        this._world.on("mousemove", this._sea.mouseMoveHandler);
        //mousewheel not part of Pixi so add the event to the DOM
        document.body.addEventListener("wheel", this._sea.mouseWheelHandler, false);

        this._world.addChild(this._sea.getContainer());
        this.update();
    }

    public update = () => 
    {

        this._sea.update();

        this._renderer.render(this._world);

        requestAnimationFrame(this.update);
    }

}

let game = new Core();
