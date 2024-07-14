import { PaddleStatus } from "./paddle-enum";

const { ccclass, property } = cc._decorator;

@ccclass
export default class PaddleController extends cc.Component {

    @property(cc.Node)
    private nodePaddle: cc.Node = null;
    @property(cc.Float)
    private deltaMove: number = 0;
    @property(cc.Integer)
    private maxRange: number = 0;
    @property(cc.Vec3)
    private startPosition: cc.Vec3 = cc.Vec3.ZERO;
    private paddleStatus: PaddleStatus = PaddleStatus.Idle;

    protected start(): void {
        this.updateMaxRangeWithPaddleSize();
    }

    private updateMaxRangeWithPaddleSize(): void {
        this.maxRange -= this.nodePaddle.width / 2;
    }

    public newGame(): void {
        this.nodePaddle.position = this.startPosition;
        this.paddleStatus = PaddleStatus.Moving;
    }

    public gameOver(): void {
        this.paddleStatus = PaddleStatus.Idle;
    }

    public moveRight(): void {
        if (this.validPaddleCanMove() == false) {
            return;
        }
        var newPosition: cc.Vec3 = this.nodePaddle.position;
        newPosition.x = newPosition.x + this.deltaMove;
        this.nodePaddle.position = newPosition;
        this.keepPaddleInRange();
    }

    public moveLeft(): void {
        if (this.validPaddleCanMove() == false) {
            return;
        }
        var newPosition: cc.Vec3 = this.nodePaddle.position;
        newPosition.x = newPosition.x - this.deltaMove;
        this.nodePaddle.position = newPosition;
        this.keepPaddleInRange();
    }

    public moveTo(positionX: number): void {
        if (this.validPaddleCanMove() == false) {
            return;
        }
        var newPosition: cc.Vec3 = this.nodePaddle.position;
        newPosition.x = positionX;
        this.nodePaddle.position = newPosition;
        this.keepPaddleInRange();
    }

    private keepPaddleInRange(): void {
        var paddlePosition: cc.Vec3 = this.nodePaddle.position;
        var paddlePositionX: number = this.nodePaddle.position.x;

        if (paddlePositionX > this.maxRange) {
            paddlePosition.x = this.maxRange;
        }
        if (paddlePositionX < -this.maxRange) {
            paddlePosition.x = -this.maxRange;
        }
        this.nodePaddle.position = paddlePosition;
    }

    private validPaddleCanMove(): boolean {
        return this.paddleStatus == PaddleStatus.Moving;
    }
}
