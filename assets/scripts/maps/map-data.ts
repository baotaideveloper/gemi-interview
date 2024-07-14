export class MapData {
    map: BrickData[] = [];
    duration: number;
    startBallSpeed: number;
}

export class BrickData {
    id: number;
    colorName: string;
    position: cc.Vec2;
}
