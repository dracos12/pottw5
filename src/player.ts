//
// player object.. stores all information on the player
// 

export default class Player
{
    private gold:number = 0;     // premium currency
    private silver:number = 0;   // basic in-game currency
    private _lastReload:number = 0;   // UTC timestamp of last reload time
    private _reloadTime:number = 30000; // player can reload every reloadTime milliseconds
    private _numReloads:number = 0; // number of times the user has reloaded

    public getGold()
    {
        return this.gold;
    }

    public getSilver()
    {
        return this.silver;
    }

    public incGold(amount:number)
    {
        this.gold += amount;
    }

    public decGold(amount:number)
    {
        this.gold -= amount;
    }
    public incSilver(amount:number)
    {
        this.silver += amount;
    }

    public decSilver(amount:number)
    {
        this.silver -= amount;
    }

    public get lastReload()
    {
        return this._lastReload;
    }

    public set lastReload(loadtime:number)
    {
        this._lastReload = loadtime;
    }

    public get reloadTime()
    {
        return this._reloadTime;
    }

    public get numReloads()
    {
        return this._numReloads;
    }

    public incReloads()
    {
        this._numReloads++;
    }
 }