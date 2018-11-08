
interface Pragma {    
    name : string;
    value : string;
}


class Pragma {
    name:string;
    value:string;

    constructor(name:string, value:string){
        this.name = name;
        this.value = value;

    }
}

export default Pragma;