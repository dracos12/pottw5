//
// sail trim widget
//
import * as PIXI from 'pixi.js';

export default class sailTrim extends PIXI.Container 
{
    private thumbSlider:PIXI.Container;
    private mainLine:PIXI.Sprite;           // block and line graphic for thumb slider
    private mainLineMask:PIXI.Graphics;     // mask for the mainLine - both become children of thumbSlider
    private trimMast:PIXI.Sprite;
    private sail:PIXI.Sprite;
    private sailContainer:PIXI.Container;   // container for the sail and its displacement texture
    private displacementFilter:PIXI.filters.DisplacementFilter;
    private displacementSprite:PIXI.Sprite;
    private displacementTexture:PIXI.Texture;
    private _showLuff:boolean = false;
    private luffDir:number = 1;

    private mouseDown:boolean = false;
    private lastY:number = -1;
    private deltaY:number;

    private sailTrimPercent:number;

    constructor()
    {
        super();
    }

    // init assumes it has its sprite assets available
    public init()
    {
        this.thumbSlider = new PIXI.Container();
        this.mainLine = new PIXI.Sprite(PIXI.Texture.fromFrame("sliderThumb2.png"));
        this.thumbSlider.addChild(this.mainLine);
        this.mainLineMask = new PIXI.Graphics();
        this.mainLineMask.beginFill(0xFF0000);
        this.mainLineMask.drawRect(0,0,this.mainLine.width,235); 
        this.mainLineMask.endFill();
        this.mainLineMask.x = 0;
        this.mainLineMask.y = this.mainLine.height/2 - this.mainLineMask.height/2; // centered on mainLine
        this.thumbSlider.addChild(this.mainLineMask);

        this.mainLine.mask = this.mainLineMask;

        this.sail = new PIXI.Sprite(PIXI.Texture.fromFrame("Sail_Yscale.png"));
        // this.sail.x = -7;
        // this.sail.y = 56;
        //this.addChild(this.sail);

        this.displacementTexture = PIXI.loader.resources["images/2yYayZk.png"].texture;
        this.displacementTexture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        this.displacementSprite = new PIXI.Sprite(this.displacementTexture);
        // this.displacementSprite.width = this.sail.width; // resize to same dimensions as the sail
        // this.displacementSprite.height = this.sail.height;
        // this.displacementSprite.scale.x = 4;
        this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);
        

        this.sailContainer = new PIXI.Container();
        this.sailContainer.addChild(this.sail);
        this.sailContainer.x = -7;
        this.sailContainer.y = 56;
        this.sailContainer.addChild(this.displacementSprite);
        this.addChild(this.sailContainer);

        this.trimMast = new PIXI.Sprite(PIXI.Texture.fromFrame("sliderBack.png"));
        this.addChild(this.trimMast); // 0,0

        this.thumbSlider.x = 70;         // thumbSlider is 454 pix tall and will slide under mask so only 235 of it is viewed at one time
        this.thumbSlider.y = -60;
        this.addChild(this.thumbSlider); // add the thumbslider to our own container

        this.mainLine.interactive = true;
        this.mainLine.on("mousemove", this.mouseMoveHandler);
        this.mainLine.on("mousedown", this.mouseDownHandler);
        this.mainLine.on("mouseup", this.mouseUpHandler);

        this.setSailTrimPercent(0); // default to all stop

    }

    public showLuff()
    {
        this.sailContainer.filters = [this.displacementFilter];
        this._showLuff = true;
    }

    public hideLuff()
    {
        this.sailContainer.filters = [];
        this._showLuff = false;
    }

    public getSailTrimPercent()
    {
        return this.sailTrimPercent;
    }

    public setSailTrimPercent(percent:number)
    {
        // set the percentage here
        this.sailTrimPercent = percent; //(this.mainLine.y + 100) / 210;

        // set the mainLine position
        this.mainLine.y = -100 + 210 * percent; // -100 is the zero position in y for the main sheet block
                        
        // sail scale goes from 0 - > 1.33 -- capped for visual appeal
        this.sailContainer.scale.y = this.sailTrimPercent * 1.33;
    }

    mouseMoveHandler = (e:any) => {

        if (e.data.buttons == 0) {
            if (this.mouseDown)
            {
                this.endSetTrim();
            }
        }

        if (this.mouseDown)
        {
            // move the mainlLine up and down only depending on delta in Y
            if (this.lastY != -1) {
                this.deltaY = (this.lastY - e.data.global.y) * (1 / this.scale.y);
                // move the mainLine
                this.mainLine.y -= this.deltaY;
                // cap the movement
                if (this.mainLine.y < -100)
                    this.mainLine.y = -100;
                else if (this.mainLine.y > 110)
                    this.mainLine.y = 110;

                // set the percentage here
                this.sailTrimPercent = (this.mainLine.y + 100) / 210;

                // sail scale goes from 0 - > 1.33 -- capped for visual appeal
                this.sailContainer.scale.y = this.sailTrimPercent * 1.33;
            }

            this.lastY = e.data.global.y;
        }
    }

    mouseDownHandler = (e:any) => {
        if (e.target == this.mainLine)
        {
            this.mouseDown = true;
        }
        
    }

    mouseUpHandler = (e:any) => {
        // release mouse no matter what the e.target was
        this.endSetTrim();
    }

    private endSetTrim()
    {
        this.mouseDown = false;
        this.lastY = -1;

        var myEvent = new CustomEvent("sailTrimEvent",
        {
            'detail': this.sailTrimPercent
        });

        window.dispatchEvent(myEvent);
    }

    public update()
    {
        if (this._showLuff)
        {
            // if (this.displacementSprite.x >= this.sail.width)
            //     this.luffDir = -1;
            // if (this.displacementSprite.x < 0)
            //     this.luffDir = 1;
            this.displacementSprite.x += 3; // * this.luffDir;
            this.displacementSprite.y += 3;
            //this.displacementSprite.y += 2;
        }   
    }
}