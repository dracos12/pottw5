import * as PIXI from 'pixi.js';

export default class Core {
    private _renderer:PIXI.CanvasRenderer|PIXI.WebGLRenderer;
    private _world:PIXI.Container;

    constructor() {
        this._renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
        this._world = new PIXI.Container();
        document.body.appendChild(this._renderer.view);
        let map1:PIXI.Sprite = new PIXI.Sprite(PIXI.Texture.fromImage('images/4x4Region1/image_part_007.png'));
        this._world.addChild(map1);
        this.update();
    }

    public update = () => {
        
        this._renderer.render(this._world);

        requestAnimationFrame(this.update);
    }
}

let game = new Core();