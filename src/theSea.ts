
import * as PIXI from 'pixi.js';

export default class theSea 
{
    private container:PIXI.Container = new PIXI.Container();
    
    private deltaX:number = 0;
    private deltaY:number = 0;
    private lastX:number = -1;
    private lastY:number = -1;

    private loadCallback:Function;

    // when done loading, arrange the sea tiles on theSea container
    setup = () => {
        let map1 = new PIXI.Sprite(PIXI.loader.resources["images/4x4Region1/image_part_002.png"].texture);
        let map2 = new PIXI.Sprite(PIXI.loader.resources["images/4x4Region1/image_part_003.png"].texture);
        let map3 = new PIXI.Sprite(PIXI.loader.resources["images/4x4Region1/image_part_004.png"].texture);
        let map4 = new PIXI.Sprite(PIXI.loader.resources["images/4x4Region1/image_part_005.png"].texture);
        let map5 = new PIXI.Sprite(PIXI.loader.resources["images/4x4Region1/image_part_006.png"].texture);
        let map6 = new PIXI.Sprite(PIXI.loader.resources["images/4x4Region1/image_part_007.png"].texture);
        let map7 = new PIXI.Sprite(PIXI.loader.resources["images/4x4Region1/image_part_008.png"].texture);
        let map8 = new PIXI.Sprite(PIXI.loader.resources["images/4x4Region1/image_part_009.png"].texture);
        let map9 = new PIXI.Sprite(PIXI.loader.resources["images/4x4Region1/image_part_010.png"].texture);
        let map10 = new PIXI.Sprite(PIXI.loader.resources["images/4x4Region1/image_part_011.png"].texture);
        let map11 = new PIXI.Sprite(PIXI.loader.resources["images/4x4Region1/image_part_012.png"].texture);
        let map12 = new PIXI.Sprite(PIXI.loader.resources["images/4x4Region1/image_part_013.png"].texture);
        let map13 = new PIXI.Sprite(PIXI.loader.resources["images/4x4Region1/image_part_014.png"].texture);
        let map14 = new PIXI.Sprite(PIXI.loader.resources["images/4x4Region1/image_part_015.png"].texture);
        
        // arranged left to right top to bottom
        // however the upleft tile is empty as is the lower left tile.. only tiles 2-15 are not empty sea
        map1.x = 2048; map1.y = 0; 
        map2.x = 4096; map2.y = 0; 
        map3.x = 6144; map3.y =0;
        map4.x = 0; map4.y = 2048; 
        map5.x = 2048; map5.y = 2048; 
        map6.x = 4096; map6.y = 2048; 
        map7.x = 6144; map7.y = 2048; 
        map8.x = 0; map8.y = 4096; 
        map9.x = 2048; map9.y = 4096; 
        map10.x = 4096; map10.y = 4096;
        map11.x = 6144; map11.y = 4096;
        map12.x = 0; map12.y = 6144; 
        map13.x = 2048; map13.y = 6144;
        map14.x = 4096; map14.y = 6144; 

        this.container.addChild(map1);
        this.container.addChild(map2);
        this.container.addChild(map3);
        this.container.addChild(map4);
        this.container.addChild(map5);
        this.container.addChild(map6);
        this.container.addChild(map7);
        this.container.addChild(map8);
        this.container.addChild(map9);
        this.container.addChild(map10);
        this.container.addChild(map11);
        this.container.addChild(map12);
        this.container.addChild(map13);
        this.container.addChild(map14);

        this.container.scale.x = this.container.scale.y = 0.10;

        this.loadCallback();

    }

    init(callback: Function)
    {
        // load our background sea tiles
        PIXI.loader
            .add("images/4x4Region1/image_part_002.png")
            .add("images/4x4Region1/image_part_003.png")
            .add("images/4x4Region1/image_part_004.png")
            .add("images/4x4Region1/image_part_005.png")
            .add("images/4x4Region1/image_part_006.png")
            .add("images/4x4Region1/image_part_007.png")
            .add("images/4x4Region1/image_part_008.png")
            .add("images/4x4Region1/image_part_009.png")
            .add("images/4x4Region1/image_part_010.png")
            .add("images/4x4Region1/image_part_011.png")
            .add("images/4x4Region1/image_part_012.png")
            .add("images/4x4Region1/image_part_013.png")
            .add("images/4x4Region1/image_part_014.png")
            .add("images/4x4Region1/image_part_015.png")
            .load(this.setup);

        this.loadCallback = callback;
    
        // add listener to the stage - stage declared in main, top level js file
        //PIXI.stage.on("mousemove", this.mouseMoveHandler);
    }

    public getContainer()
    {
        return this.container;
    }

}