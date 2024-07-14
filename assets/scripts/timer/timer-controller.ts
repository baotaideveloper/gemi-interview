import GameController from "../game/game-controller";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TimerController extends cc.Component {

    @property(cc.Label)
    private labelTime: cc.Label = null;
    @property(cc.Integer)
    private timePerRound: number = 0;
    private isCounting: boolean = false;

    private _currentTime: number;
    public get currentTime(): number {
        return this._currentTime;
    }
    public set currentTime(v: number) {
        this._currentTime = v;
        this.labelTime.string = v.toFixed(2).toString();
    }

    public startTime(): void {
        this.isCounting = true;
    }

    protected update(dt: number): void {
        if (this.isCounting) {
            this.currentTime -= dt;
            if (this.currentTime <= 0) {
                this.currentTime = 0;
                GameController.instance.gameOver();
            }
        }
    }

    public stopTime(): void {
        this.isCounting = false;
    }

    public setTime(time: number): void {
        this.currentTime = time;
    }
}
