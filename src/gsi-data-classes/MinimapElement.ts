import gsi from "node-gsi";

export default class MinimapElement {
    public readonly unitName: string;
    public readonly xPos: number;
    public readonly yPos: number;
    public readonly team: string | undefined;

    constructor(
        unitName: string,
        xPos: number,
        yPos: number,
        team: string | null
    ) {
        this.unitName = unitName;
        this.xPos = xPos;
        this.yPos = yPos;
        this.team = team ? team : undefined;
    }

    static create(element: gsi.IMinimapElement) {
        return new MinimapElement(
            element.unitname,
            element.xpos,
            element.ypos,
            element.team
        );
    }
}
