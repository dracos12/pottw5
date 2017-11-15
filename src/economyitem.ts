//
// EconomyItem - structure public class to store data of player items
//

import theSea from './theSea';

export default class EconomyItem
{
    public static jsonData:any;
    public static maxItems:number = 56;  // there are 56 economy items currently
    public type:number;    // the id into the json data for this item
    public rarity:number;  // 0=grey(common), 1=green(uncommon), 2=blue(rare), 3=ltblue(consumable)
    public maxStack:number = 1; // how many can stack in one unit
    public size:number;    // how many squares this item consumes ion the inventory grid
    public value:number;

    constructor(type:number, rarity?:number)
    {
        this.type = type;
        if (rarity)
        {
            this.rarity = rarity;
        }
        else // 85% common, 10% uncommon, 5% rare
        {
            var rand = theSea.getRandomIntInclusive(1,100);
            if (rand <= 85)
                this.rarity = 0;
            else if (rand <= 95)
                this.rarity = 1;
            else
                this.rarity = 2;
        }

        if (EconomyItem.jsonData)
        {
            this.size = EconomyItem.jsonData[this.type].size;
            this.value = EconomyItem.jsonData[this.type].value;
        }
    }

    public static setEconomyData(jsonData:any)
    {
        this.jsonData = jsonData;
    }
}
