import GameObject from './gameobject';
import { ObjectType } from './gameobject';

export default class Island extends GameObject
{
    constructor()
    {
        super();
        this.objType = ObjectType.ISLAND;
    }
}