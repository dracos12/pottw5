
import * as PIXI from 'pixi.js';
import GameObject  from './gameobject';
import { ObjectType } from './gameobject';
import Island from './island';
import Ship from './ship';
import FXManager from './fxmanager';
import SingletonClass from './singleton';
import Victor = require('victor');
import SelectWidget from './selectwidget';
import { SelectType } from './selectwidget';

declare var PolyK: any;

export default class theSea 
{
    private container:PIXI.Container = new PIXI.Container();
    
    private deltaX:number = 0;
    private deltaY:number = 0;
    private lastX:number = -1;
    private lastY:number = -1;

    private loadCallback:Function;

    private islandArray: Array<GameObject> = []; // array of all sprites added to theSea islands and ships (later, projectiles as well)
    private shipArray: Array<Ship> = [];    // pool of boats on theSea
    private wheelScale = 0.25;
    private mouseDown:boolean = false;

    private selectedBoat:Ship; // what boat does the user have selected
    private selectWidget:SelectWidget;
    private playerSelected:boolean = false;

    private targetedBoat:Ship = null;          // user can target a boat for information
    private boatTargeted:boolean = false;
    private targetWidget:SelectWidget;

    private islandsLoaded:boolean = false;
    private boatsLoaded:boolean = false;

    private boatData:any;   // save the json data to pass to boats as they are created

    // layers so sea tiles always sorted beneath ships/islands
    private layerSeaTiles:PIXI.Container = new PIXI.Container();
    private layerSelection:PIXI.Container = new PIXI.Container();
    private layerObjects:PIXI.Container = new PIXI.Container();
    private layerUI:PIXI.Container = new PIXI.Container();

    private numPorts:number=0;  // number of islands in the island array that are ports

    private fxManager:FXManager; // manager class to manage cannon balls, fire, smoke, and other effects

    public getWheelScale()
    {
        return this.wheelScale;
    }
    
    // javascript style mouse wheel handler, pixi does not support mouse wheel
    mouseWheelHandler = (e:any) => {
        //console.log(e);

        if (e.wheelDelta > 0) { // scroll in
            this.wheelScale += 0.05;
            if (this.wheelScale > 2.0)
                this.wheelScale = 2.0;
            //console.log("wheel in");
        } else { // scroll out
            this.wheelScale -= 0.05;
            if (this.wheelScale < 0.10)
                this.wheelScale = 0.10;
            //console.log("wheel out");
        }

        let pos = new PIXI.Point(e.clientX, e.clientY);
        let preZoomWorld:PIXI.Point = this.container.toLocal(pos); //this.screenToWorld(e.clientX, e.clientY);  
        
        //
        // perform the scale to the container
        //
        this.container.scale.x = this.container.scale.y = this.wheelScale;
        
        // console.log("scale: " + this.wheelScale.toFixed(2) + 
        //             " pos: " + this.container.x.toFixed(2) + "," + this.container.y.toFixed(2) + " " + 
        //             "w: " + this.container.width.toFixed(2) + 
        //             " h: " + this.container.height.toFixed(2) +
        //             " mouse: " + e.clientX + "," + e.clientY
        //             );

        //where is the zoom location now, after we changed the scale?
        let postZoomWorld = this.container.toLocal(pos); //this.screenToWorld(e.clientX, e.clientY);
        
        //console.log("pre: " + preZoomWorld.x + "," + preZoomWorld.y + " post: " + postZoomWorld.x + "," + postZoomWorld.y);

        let preZoomGlobal = this.container.toGlobal(preZoomWorld);
        let postZoomGlobal = this.container.toGlobal(postZoomWorld);
        
        //move the world so that the zoomed-location goes back to where it was on the screen before scaling        
        this.container.x += postZoomGlobal.x - preZoomGlobal.x ;   
        this.container.y += postZoomGlobal.y - preZoomGlobal.y; 
    }

    mouseUpHandler = (e:any) => {
        this.mouseDown = false;
    }
    
    mouseDownHandler = (e:any) => {
        if (e.target == this.container)
            this.mouseDown = true;
    }

    // pixi style event handler, not the same arguments as javascript mouse event
    mouseMoveHandler = (e:any) => {
        //document.getElementById("log").innerText = e.type;
        //console.log("G: " +e.data.global.x + "," + e.data.global.y);
        //console.log("mouseMoved");
        // console.log(this);

       // console.log("L: " + this.container.toLocal(e.data.global).x + ", " + this.container.toLocal(e.data.global).y);

        if (e.target != this.container)
        {
            return;
        }

        if (e.data.buttons == 0)
            this.mouseDown = false;

        if (this.mouseDown) // left button is down 
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

        /*
         *
         * mousemove/mouseover functionality for islands - test with polyk, prolly better done with pixi handling
         * 
        //take the mouse coords and convert to world coords
        let pos = new PIXI.Point(e.data.global.x, e.data.global.y);
        let mouseWorld:PIXI.Point = this.container.toLocal(pos);
        // now convert this to cartesian coordinates
        // x is fine as is
        // y is inverted from bottom left of sea tiles 0,8192
        mouseWorld.y = 8192 - mouseWorld.y;

        // walk the object array and perform a PolyK hittest against each island
        for (let entry of this.objectArray) {
            if (entry.getType() == ObjectType.ISLAND || entry.getType() == ObjectType.SHIP) {
                var retVal = entry.cartesianHitTest(mouseWorld);
                if (retVal == true) {
                    //console.log("Hit over " + entry.getSprite().name);
                } else { 
                    //console.log("hitTest returns: " + retVal + " mouse: " + mouseWorld.x + "," + mouseWorld.y);
                }
            }
        }
        */
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
        let map15 = new PIXI.Sprite(PIXI.loader.resources["images/4x4Region1/image_part_016.png"].texture);
        
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
        map15.x = 6144; map15.y = 6144;

        this.layerSeaTiles.addChild(map1);
        this.layerSeaTiles.addChild(map2);
        this.layerSeaTiles.addChild(map3);
        this.layerSeaTiles.addChild(map4);
        this.layerSeaTiles.addChild(map5);
        this.layerSeaTiles.addChild(map6);
        this.layerSeaTiles.addChild(map7);
        this.layerSeaTiles.addChild(map8);
        this.layerSeaTiles.addChild(map9);
        this.layerSeaTiles.addChild(map10);
        this.layerSeaTiles.addChild(map11);
        this.layerSeaTiles.addChild(map12);
        this.layerSeaTiles.addChild(map13);
        this.layerSeaTiles.addChild(map14);
        this.layerSeaTiles.addChild(map15);

        this.container.addChild(this.layerSeaTiles); // sea tiles sort to bottom
        this.container.addChild(this.layerSelection);
        this.container.addChild(this.layerObjects); // all other objects will sort above it
        this.container.addChild(this.layerUI);

        this.container.scale.x = this.container.scale.y = this.wheelScale; 

        this.loadRegion(); // for now this loads the islands, ideally it will load the sea tiles too

        this.fxManager.onAssetsLoaded(); // fxManager can now initialize with its assets
    
        this.selectWidget = new SelectWidget(SelectType.FRIENDLY);
        this.targetWidget = new SelectWidget(SelectType.ENEMY);
    }

    public getUILayer()
    {
        return this.layerUI;
    }

    public selectPlayer()
    {
        // put the sleect widget under the player boat
        var ref = this.selectedBoat.getRefPtVictor();
        this.selectWidget.x = ref.x;
        this.selectWidget.y = ref.y;
        this.layerSelection.addChild(this.selectWidget);
        this.selectWidget.play();
        this.playerSelected = true;
    }

    public deselectPlayer()
    {
        this.layerSelection.removeChild(this.selectWidget);
        this.selectWidget.stop();
        this.playerSelected = false;
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
            .add("images/4x4Region1/image_part_016.png")
            .add("images/islands/region1islands.json")        // loader automagically loads all the textures in this atlas
            .add("images/ships/corvette2.json")
            .add("images/islands/trinidad.png")
            .add("images/ships/xebec.json")
            .add("images/ships/brig.json")

        this.loadCallback = callback;

        this.fxManager = new FXManager();
        this.fxManager.addLoaderAssets(); // have fxManager request its assets
        this.fxManager.setFXContainer(this.layerObjects); // give the fxManager its layer to add fx to

        this.container.interactive = true;
        this.container.on("mousemove", this.mouseMoveHandler);
        this.container.on("mouseup",this.mouseUpHandler);
        this.container.on("mousedown",this.mouseDownHandler);

        //Attach event listeners
        window.addEventListener(
        "keydown", this.keyDownHandler, false
        );
        window.addEventListener(
        "keyup", this.keyUpHandler, false
        );

        window.addEventListener("sailTrimEvent", this.sailTrimHandler, false);
        window.addEventListener("aiShipMouseDown", this.aiShipMouseDown, false);
        window.addEventListener("aiReSpawn", this.aiShipRespawn, false);
    }

    aiShipMouseDown = (e:any) => {
        // mouse down on non-wrecked ai boat
        var boat:Ship = e.detail;
        // put target widget on its position
        if(this.targetedBoat != boat) {
            if (this.targetedBoat != null){
                this.targetedBoat.hideAITarget();
            }
            this.targetedBoat = boat;
            var ref = this.targetedBoat.getRefPtVictor();
            this.targetWidget.x = ref.x;
            this.targetWidget.y = ref.y;
            this.layerSelection.addChild(this.targetWidget);
            this.targetWidget.scale.x = this.targetWidget.scale.y = 0.8 * this.targetedBoat.getSprite().scale.x; // select widget is 0.8 not 1.0 originally
            this.targetWidget.play();
            this.boatTargeted = true;
            this.targetedBoat.showAITarget();
        } else {
            // clicked target again, detarget
        }
    }

    private clearTarget()
    {
        this.layerSelection.removeChild(this.targetWidget);
        this.targetWidget.stop();
        this.boatTargeted = false;
        this.targetedBoat = null;
        var myEvent = new CustomEvent("clearTarget",
        {
            'detail': 0
        });
        window.dispatchEvent(myEvent);
        console.log("Sending clearTarget msg to HUD");
    }

    sailTrimHandler = (event:any) => {
        // event.detail contains the data of percent 0->1 of of sail trim.. hadn this down to our boat
        this.selectedBoat.setSailTrim(event.detail);
    }

    keyDownHandler = (event:any) => {
        //console.log("Pressed key: " + event.keyCode);
        if (event.keyCode === 38) { // up
            this.selectedBoat.increaseSail();
        }
        else if (event.keyCode === 40) { // down
            this.selectedBoat.decreaseSail();
        }
        else if (event.keyCode === 37) { // left
            this.selectedBoat.wheelLarboard();
        }
        else if (event.keyCode === 39) { // right
            this.selectedBoat.wheelStarboard();
        }
    }

    keyUpHandler = () => {
    }

    aiShipRespawn = (e:any) => {
        var poolID = e.detail;
        if (this.targetedBoat != null && this.targetedBoat.getPoolID() == poolID) {
            this.clearTarget();
        }
        this.reSpawnAI(poolID);
    }

    private loadRegion(regionName: string = "region1") 
    {
        // load the region1 background sea tiles

        // load the region1 islands

        // load the island game data 
        this.loadJSON("./data/region1isles.json", this.onIslesLoaded)

        // load the boat data
        this.loadJSON("./data/shipdata.json", this.onBoatsLoaded);

    }

    private onBoatsLoaded = (responseText:string) => 
    {
        var json_data = JSON.parse(responseText);
        //console.log(json_data);

        // save the boat data to hand to boast as they are created
        this.boatData = json_data;
        SingletonClass.setBoatData(this.boatData); // save the boat data to the singleton

        // run through all entries in the json
        // for (var key in json_data) {
        //     if (json_data.hasOwnProperty(key)) { // "corvette" is the only boat so far 
        //         if (key == "corvette") // we good
        //         {

        //         } else {
        //             console.log("Found unrecognized key: " + key);
        //         }
        //     }
        // }

        this.boatsLoaded = true;

        this.checkFinishLoad();
    }

    private onIslesLoaded = (responseText:string) => 
    {
        var json_data = JSON.parse(responseText);
        //console.log(json_data);
        //console.log(PIXI.loader.resources);

        // run through all entries in the json
        for (var key in json_data) {
            if (json_data.hasOwnProperty(key)) {
                // create a sprite for each
                let isle = new Island();

                var sprite;

                if (key == "Trinidad") // loaded independently, not within an atlas
                {
                    sprite = new PIXI.Sprite(PIXI.loader.resources["images/islands/trinidad.png"].texture);
                }
                else
                {
                    sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(json_data[key].fileName));
                }
                
                // position the sprite according to the data
                sprite.x = json_data[key].x;
                sprite.y = json_data[key].y;

                // tag each sprite with its name (the key)
                sprite.name = key;

                // add sprite to the isle, this container, and the tracked object array
                isle.setSprite(sprite);
                this.layerObjects.addChild(sprite);
                this.islandArray.push(isle);

                // save its polygonal data
                isle.setPolyData(json_data[key].polygonPts);
                isle.setData(json_data[key]); // save out the entire entry for isle's later use
                if (isle.isPort())
                {
                    this.numPorts++;
                    //console.log("Discovered Port: " + json_data[key].portName)
                    sprite.hitArea = new PIXI.Polygon(json_data[key].polygonPts);
                }

                //console.log("Adding " + sprite.name + " to theSea");
            }
        }

        this.islandsLoaded = true;
        this.checkFinishLoad();
    }

    // make sure all asyncronous loads have completed
    private checkFinishLoad() {
        if (this.boatsLoaded && this.islandsLoaded)
        {

            // add the player boat near guadelupe
            let boat = new Ship();
            boat.init(this.boatData.corvette, this.islandArray);
            boat.setPosition(6200,2600);
            boat.setFXManager(this.fxManager); // so the ship can fire cannonballs!
            this.layerObjects.addChild(boat.getSprite());
            var index = this.shipArray.push(boat) - 1;
            boat.setPoolID(index);
            
            this.selectedBoat = boat;
            // send a message that we have a new selected boat
            var myEvent = new CustomEvent("boatSelected",
            {
                'detail': this.selectedBoat
            });
    
            window.dispatchEvent(myEvent);

            // spawn some AI boats to sail about
            this.spawnAIBoats();

            // give the isle and boats list to the fxmanager
            this.fxManager.setIslesShips(this.islandArray, this.shipArray);

            // final step in loading process.. can now call loadcallback
            this.loadCallback();
        }
    }

    private reSpawnAI(id:number)
    {
        var boat = this.shipArray[id];
        // reinitialize the ship
        let portPt = this.getRandomPortDest();
        let edgePt = this.getRandomEdgeDest();
        if (theSea.getRandomIntInclusive(0,1) == 1) // potentially flip destination
            boat.respawnAI(edgePt, portPt);
        else
            boat.respawnAI(portPt, edgePt);
        //console.log("Respawning AI#: " + id);
    }

    private spawnAIBoats()
    {
        var NUMBOATS = 99;
        for (var i=0;i<NUMBOATS;i++)
        {
            let boat = new Ship();
            let portPt = this.getRandomPortDest();
            let edgePt = this.getRandomEdgeDest();
            if (NUMBOATS == 1)
            {
                let pos = new PIXI.Point(6200,2600);
                boat.init(this.boatData.corvette, this.islandArray, true, pos, portPt);
            }
            else
            {
                var boatData:any;
                var die = theSea.getRandomIntInclusive(0,9); // flip for what kind of boat
                if ( die == 9) // 10% corvettes
                    boatData = this.boatData.corvette;
                else if (die >= 7) // 20% brigs
                    boatData = this.boatData.brig;
                else // 70% xebecs
                    boatData = this.boatData.xebec;

                if (theSea.getRandomIntInclusive(0,1) == 1) // potentially flip destination
                    boat.init(boatData, this.islandArray, true, edgePt, portPt);
                else
                    boat.init(boatData, this.islandArray, true, portPt, edgePt);
            }

            boat.setFXManager(this.fxManager); // so the ship can fire cannonballs!

            this.layerObjects.addChild(boat.getSprite());
            var len = this.shipArray.push(boat);
            boat.setPoolID(len-1); // set the index on the boat so it can inform the pool when it needs to respawn
        }
    }

    public clearPlayerTarget()
    {
        for (let boat of this.shipArray)
            boat.clearPlayerTarget();
    }

    private loadJSON(jsonFile:string, callback:Function) 
    {
        var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
        xobj.open('GET', jsonFile, true); 
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == 200) {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                callback(xobj.responseText);
            }
        };
        xobj.send(null);  
    }

    private getRandomEdgeDest()
    {
        // return a point along the edge of the map
        var randx = theSea.getRandomIntInclusive(0,8192);
        var randy = theSea.getRandomIntInclusive(0,8192);
        if (theSea.getRandomIntInclusive(0,1) == 1)
        {
            if (theSea.getRandomIntInclusive(0,1) == 1)
                return new PIXI.Point(0,randy); // left edge
            else
                return new PIXI.Point(8192, randy); // right edge
        }
        else
        {
            if (theSea.getRandomIntInclusive(0,1) == 1)
                return new PIXI.Point(randx,0); // top edge
            else    
                return new PIXI.Point(randx, 8192); // bottom edge
        }
    }

    private getRandomPortDest()
    {
        // return a random port destination
        var desiredPort = theSea.getRandomIntInclusive(1,this.numPorts);
        var portCount = 0;
        var isle;

        //console.log("DesiredPort: " + desiredPort +  " numPorts: " + this.numPorts);

        // loop through the island array
        for (let gameObj of this.islandArray)
        {
            if (<Island>gameObj && (<Island>gameObj).isPort())
            {
                portCount++;
                if (portCount == desiredPort)
                {
                    //console.log("RandomPort Dest: " + (<Island>gameObj).getName());
                    return (<Island>gameObj).getPortDest();
                }
            }
        }
    }

    public static getRandomIntInclusive(min:number, max:number) {
        // min = Math.ceil(min);
        // max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
    }

    public getContainer()
    {
        return this.container;
    }

    //
    // update function called per frame
    //
    public update()
    {
        if (this.deltaX != 0 || this.deltaY != 0)
        {
            this.container.x += this.deltaX;
            this.container.y += this.deltaY;

            if (this.container.x > 0)
                this.container.x = 0;
            
            if (this.container.y > 0 + 40)
                this.container.y = 0 + 40;  // adjust for top hud

            if (this.container.x < -(this.container.width - window.innerWidth))
                this.container.x = -(this.container.width - window.innerWidth);

            if (this.container.y < -(this.container.height - window.innerHeight + 100)) // adjust for bottom hud
                this.container.y = -(this.container.height - window.innerHeight + 100);

            this.deltaX = 0;
            this.deltaY = 0; // clear the data, await next mousemove
        }

        // console.log(this.deltaX + "," + this.deltaY);

        this.updateObjectArray();

        this.fxManager.update();

        var ref;

        if (this.playerSelected) {
            ref = this.selectedBoat.getRefPtVictor();
            this.selectWidget.x = ref.x;
            this.selectWidget.y = ref.y;
        }

        if (this.boatTargeted)
        {
            ref = this.targetedBoat.getRefPtVictor();
            this.targetWidget.x = ref.x;
            this.targetWidget.y = ref.y;
        }
    }

    private updateObjectArray()
    {
        // sort the children ascending as the renderer will render sprites in container ordrer
        this.layerObjects.children.sort(this.objSort);

        var nearPort:boolean = false;
        // loop through our object array and call each element's update function
        for (let gameObj of this.islandArray)
        {
            var boat = SingletonClass.ship;
            gameObj.update();
            if (!nearPort)
            {
                if ((<Island>gameObj).isPort())
                {
                    var isle = <Island>gameObj;
                    // check its port ref against the player boat position
                    var boatPt = boat.getRefPtVictor();
                    var islePt = isle.getPortDestVictor(); // ref math already included here
                    // if close enough, enable the port button on the main hud
                    var dist = Math.abs(boatPt.distance(islePt));
                    if (dist < 150)
                    {
                        nearPort = true;
                        SingletonClass.currentPort = isle.getName();
                    }
                }
            }
        }

        if (!nearPort) // not near a port, clear the currentPort string HUD uses to enable anchor button
            SingletonClass.currentPort = "";

        for (let gameObj of this.shipArray)
        {
            gameObj.update();
        }

        // check for collisions against the playerboat
        this.checkPlayerBoatCollision();
    }

    private objSort(a:PIXI.DisplayObject, b:PIXI.DisplayObject)
    {
        var aY = a.y + (<PIXI.Sprite>a).height/2;
        var bY = b.y + (<PIXI.Sprite>b).height/2;

        if (aY < bY)
            return -1;
        else if (aY == bY)
            return 0;
        else if (aY > bY)
            return 1;
        else 
            return 0;
    }

    public getIslandList()
    {
        return this.islandArray;
    }

    private checkPlayerBoatCollision() {
        // first do a simple box hit test against the player boat and all the islands
        var hit = false;
        for (let entry of this.islandArray) {
            if (entry.getType() == ObjectType.ISLAND) {
                if (theSea.boxHitTest(entry.getSprite(), this.selectedBoat.getSprite())) {
                    //console.log("boxHit!");
                    // sprites overlap, now do a PolyK hittest against all points on the boat with the islands polygonal data
                    if (this.selectedBoat.hitTestByPolygon(entry.getCartPolyData()) == true)
                    {
                        console.log("Boat has struck - " + entry.getSprite().name);
                        this.selectedBoat.allStop();
                        this.selectedBoat.setAground(true);
                        hit = true;
                        return;
                    }
                }
            }
        }
        if (!hit)
            this.selectedBoat.setAground(false);

        // if theres a hit, perform the polyk hittest for each point in the boats polykdata against the island polygon
    }

    public static boxHitTest(s1:PIXI.Sprite, s2:PIXI.Sprite)
    {
        var x1 = s1.x;
        var y1 = s1.y;
        var w1 = s1.width;
        var h1 = s1.height;

        var x2 = s2.x;
        var y2 = s2.y;
        var w2 = s2.width;
        var h2 = s2.height;

        if (x1 + w1 > x2)
                if (x1 < x2 + w2)
                    if (y1 + h1 > y2)                
                            if (y1 < y2 + h2)                    
                                return true;    
                                
        return false;
    }

}
