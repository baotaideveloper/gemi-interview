import { BrickData } from "../maps/map-data";

const { ccclass, property } = cc._decorator;


const MAP_BRICK_SPRITE_FRAME_INDEX_WITH_COLOR: Map<string, number> = new Map([
    ['green1', 0],
    ['green2', 1],
    ['blue1', 2],
    ['blue2', 3],
    ['purple1', 4],
    ['purple2', 5],
    ['red1', 6],
    ['red2', 7],
    ['silver1', 8],
    ['silver2', 9],
    ['yellow1', 10],
    ['yellow2', 11],
]);

@ccclass
export default class Brick extends cc.Component {

    @property(cc.Sprite)
    private spriteBrick: cc.Sprite = null;

    @property([cc.SpriteFrame])
    private arraySpriteFrame: cc.SpriteFrame[] = [];

    @property(cc.RigidBody)
    private brickRigidBody: cc.RigidBody = null;

    private onHitBall: Function;

    private brickData: BrickData;
    public get BrickData(): BrickData {
        return this.brickData;
    }

    protected start(): void {
        this.registerEvent();
    }

    public initialize(brickData: BrickData, onHitBall: Function): void {
        this.brickData = brickData;
        this.onHitBall = onHitBall;
        this.updateBrickDisplay();
    }

    private registerEvent(): void {
        this.brickRigidBody.onBeginContact = this.onCollisionEnter.bind(this);
    }

    private onCollisionEnter(contact, self, other): void {
        switch (other.tag) {
            case 0:
                this.onHitBall(this);
                break;
        }
    }

    private updateBrickDisplay(): void {
        this.spriteBrick.spriteFrame = this.getBrickSpriteFrameWithColor(this.brickData.colorName);
        this.node.setPosition(this.brickData.position);
    }

    private getBrickSpriteFrameWithColor(color: string): cc.SpriteFrame {
        var index: number = MAP_BRICK_SPRITE_FRAME_INDEX_WITH_COLOR.get(color);
        return this.arraySpriteFrame[index];
    }
}
