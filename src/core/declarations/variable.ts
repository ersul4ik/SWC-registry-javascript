import Location from '../../misc/location';
import Node from '../../misc/node';
import ElementaryType from '../types/elementary_type';
import Type from '../types/type';
import Delcaration from './declaration';

class Variable extends Delcaration {
    name: string;
    type: string;
    visibility: string;
    storageLocation: string;
    isStateVar: boolean;
    isConstant: boolean;

    constructor(
        location: Location,
        scope: number,
        name: string,
        type: string,
        visibility: string,
        storageLocation: string,
        isStateVar: boolean,
        isConstant: boolean
    ) {
        super(location, scope);
        this.name = name;
        this.type = type;
        this.visibility = visibility;
        this.storageLocation = storageLocation;
        this.isConstant = isConstant;
        this.isStateVar = isStateVar;
    }
}

export default Variable;
