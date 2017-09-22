
import * as PIXI from 'pixi.js';
import GameObject from './gameobject';
import Island from './island';

export default class theSea 
{
    private container:PIXI.Container = new PIXI.Container();
    
    private deltaX:number = 0;
    private deltaY:number = 0;
    private lastX:number = -1;
    private lastY:number = -1;

    private loadCallback:Function;

    private objectArray: Array<GameObject> = []; // array of all sprites added to theSea islands and ships (later, projectiles as well)

    // pixi style event handler, not the same arguments as javascript mouse event
    mouseMoveHandler = (e:any) => {
        //document.getElementById("log").innerText = e.type;
        //console.log(e);

        // console.log(this);

        if (e.data.buttons == 1) // left button is down 
        {
            //console.log("LeftDown");
            var doDelta = true;
            if (this.lastX == -1)
                doDelta = false;

            if (doDelta)
            {
                this.deltaX = e.data.global.x - this.lastX;
                this.deltaY = e.data.global.y - this.lastY;
                //console.log(this.deltaX + "," + this.deltaY);
            }

            //console.log(e);
            //console.log(e.data.global.x + "," + e.data.global.y);
            this.lastX = e.data.global.x;
            this.lastY = e.data.global.y;
        }
        else // button is up
        {
            this.deltaX = 0;
            this.deltaY = 0;
            this.lastX = -1;
            this.lastY = -1;
        }
    }
    
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

        this.container.scale.x = this.container.scale.y = 0.25;

        this.loadRegion(); // for now this loads the islands, ideally it will load the sea tiles too
    
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
            .add("images/islands/region1atlas.json")        // loader automagically loads all the textures in this atlas
            .load(this.setup);

        this.loadCallback = callback;
    }

    private loadRegion(regionName: string = "region1") 
    {
        // load the region1 background sea tiles

        // load the region1 islands

        // load the island game data 
        this.loadJSON("./data/region1isles.json", this.onIslesLoaded)

        // islands are stored in a pool of sprites
    }

    private onIslesLoaded = (responseText:string) => 
    {
        var json_data = JSON.parse(responseText);
        console.log(json_data);
        console.log(PIXI.loader.resources);

        // run through all entries in the json
        for (var key in json_data) {
            if (json_data.hasOwnProperty(key)) {
                // create a sprite for each
                let isle = new Island();
                let sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(json_data[key].fileName));
                
                // position the sprite according to the data
                sprite.x = json_data[key].x;
                sprite.y = json_data[key].y;

                // add sprite tgo the isle, this container, and the tracked object array
                isle.setSprite(sprite);
                this.container.addChild(sprite);
                this.objectArray.push(isle);

                console.log("Adding " + key + " to theSea");
            }
        }


        // final step in loading process.. can now call loadcallback
        this.loadCallback();
    }

    private loadJSON(jsonFile:string, callback:Function) 
    {
        var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
        xobj.open('GET', './data/region1isles.json', true); // Replace 'my_data' with the path to your file
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == 200) {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                callback(xobj.responseText);
            }
        };
        xobj.send(null);  
    }

    public getContainer()
    {
        return this.container;
    }

    public update()
    {
        this.container.x += this.deltaX;
        this.container.y += this.deltaY;

        this.deltaX = 0;
        this.deltaY = 0; // clear the data, await next mousemove

        // console.log(this.deltaX + "," + this.deltaY);
    }

}