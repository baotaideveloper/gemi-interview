import GameController from "../game/game-controller";
import Brick from "./brick";
import { BrickData } from "./maps/map-data";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BrickContainer extends cc.Component {

    @property(cc.Prefab)
    private prefabBrick: cc.Prefab = null;
    @property(cc.Node)
    private bricksContent: cc.Node = null;

    @property([cc.JsonAsset])
    private jsonMaps: cc.JsonAsset[] = [];
    private arrayBricks: Brick[] = [];

    private poolBricks: cc.NodePool = new cc.NodePool();

    public newGame(bricksData: BrickData[]): void {
        this.cleanMap();
        this.generateMap(bricksData);
    }

    private generateMap(bricksData: BrickData[]): void {
        for (let index = 0; index < bricksData.length; index++) {
            const brickData = bricksData[index];
            brickData.id = index;
            var brick = this.spawnBrick();
            this.arrayBricks.push(brick);
            brick.node.setParent(this.bricksContent);
            brick.initialize(brickData, this.ballHit.bind(this));
        }
    }

    private cleanMap(): void {
        for (let index = 0; index < this.arrayBricks.length; index++) {
            const brick = this.arrayBricks[index];
            this.removeBrickInArray(brick.BrickData.id);
            this.destroyBrick(brick.node);
        }
        this.arrayBricks = [];
    }

    private spawnBrick(): Brick {
        if (this.poolBricks.size() > 0) {
            return this.poolBricks.get().getComponent(Brick);
        } else {
            return cc.instantiate(this.prefabBrick).getComponent(Brick);
        }
    }

    private ballHit(brick: Brick): void {
        this.removeBrickInArray(brick.BrickData.id);
        this.destroyBrick(brick.node);
        GameController.instance.ballHitBrick();
        if (this.validateMapClear()) {
            GameController.instance.gameFinish();
        }
    }

    private destroyBrick(brick: cc.Node): void {
        this.poolBricks.put(brick);
    }

    private removeBrickInArray(id: number): void {
        var indexToRemove = this.arrayBricks.findIndex((item) => item.BrickData.id === id);
        if (indexToRemove != -1) {
            this.arrayBricks.splice(indexToRemove, 1);
        }
    }

    private validateMapClear(): boolean {
        return this.arrayBricks.length <= 0;
    }

}
