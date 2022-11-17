import { Area } from "../area/Area.js";

export class Plan {
    constructor(name, date) {
        this.name = name;
        this.date = date;
        this.areas = [
            new Area(),
            new Area(),
            new Area()
        ];
    }
}