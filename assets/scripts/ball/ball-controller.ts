import Ball from "./ball";
import { BallType } from "./ball-enum";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BallController extends cc.Component {

    @property(Ball)
    private normalBall: Ball = null;
    @property(Ball)
    private speedUpBall: Ball = null;

    private currentBall: Ball;

    protected start(): void {
    }

    public selectBall(ballType: BallType): void {
        switch (ballType) {
            case BallType.Normal:
                this.currentBall = this.normalBall;
                break;
            case BallType.SpeedUp:
                this.currentBall = this.speedUpBall;
                break;
        }
    }

    public startMove(): void {
        this.currentBall.startMove();
    }

    public stopMove(): void {
        this.currentBall.stopMove();
    }

    public newGame(ballSpeed: number): void {
        this.currentBall.resetDefault();
        this.currentBall.setBallSpeed(ballSpeed);
        this.currentBall.ready();
    }
}
