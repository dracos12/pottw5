import * as PIXI from 'pixi.js';
import theSea from './theSea';

export default class Core {
    private _renderer:PIXI.CanvasRenderer|PIXI.WebGLRenderer;
    private _world:PIXI.Container;
    private _sea:theSea;

    constructor() {
        this._renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
        this._world = new PIXI.Container();
        document.body.appendChild(this._renderer.view);

        // create a new sea object
        this._sea = new theSea();
        this._sea.init(this.seaLoadedCallback);
    }

    private seaLoadedCallback = () =>
    {
        this._world.addChild(this._sea.getContainer());
        this.update();
    }

    public update = () => 
    {
        
        this._renderer.render(this._world);

        requestAnimationFrame(this.update);
    }

}

let game = new Core();