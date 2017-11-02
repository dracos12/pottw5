//
// player object.. stores all information on the player
// 

export default class Player
{
    private gold:number = 0;    // premium currency
    private silver:number = 0;  // basic in-game currency

    public getGold()
    {
        return this.gold;
    }

    public getSilver()
    {
        return this.silver;
    }

    public incSilver(amount:number)
    {
        this.silver += amount;
    }

    public decSilver(amount:number)
    {
        this.silver -= amount;
    }
 }