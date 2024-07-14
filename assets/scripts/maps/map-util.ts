import { BrickData, MapData } from "./map-data";

export class MapUtil {
    public static convertJsonToMapData(jsonData: cc.JsonAsset): MapData {
        var mapData: MapData = new MapData();
        var json = jsonData.json;
        mapData.duration = json.duration;
        mapData.startBallSpeed = json.startBallSpeed;
        for (let index = 0; index < json.map.length; index++) {
            const jsonBrick = json.map[index];
            var brickData: BrickData = new BrickData();
            brickData.colorName = jsonBrick.color;
            brickData.position = new cc.Vec2(jsonBrick.position.x, jsonBrick.position.y);
            mapData.map.push(brickData);
        }

        return mapData;
    }
}