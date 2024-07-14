import BallController from "../ball/ball-controller";
import { BallType } from "../ball/ball-enum";
import BrickContainer from "../bricks/bricks-container";
import { MapUtil } from "../bricks/maps/map-util";
import { GAME_EVENT } from "../events/game-event-config";
import PaddleController from "../paddle/paddle-controller";
import TimerController from "../timer/timer-controller";
import UIController from "../ui/ui-controller";
import UISelectBall from "../ui/ui-select-ball";
import { EnumGameState } from "./game-enum";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameController extends cc.Component {

    @property(cc.Node)
    private nodeEventEmitter: cc.Node = null;
    @property(PaddleController)
    private paddleController: PaddleController = null;
    @property(BrickContainer)
    private brickContainer: BrickContainer = null;
    @property(UIController)
    private uiController: UIController = null;
    @property(TimerController)
    private timerController: TimerController = null;
    @property(BallController)
    private ballController: BallController = null;
    @property(UISelectBall)
    private uiSelectBall: UISelectBall = null;
    @property(cc.Integer)
    private maxLevel: number = 0;
    private currentLevel: number = 0;

    @property([cc.JsonAsset])
    private jsonMaps: cc.JsonAsset[] = [];

    private static _instance: GameController = null;
    public static get instance(): GameController {
        return this._instance;
    }
    private enumGameState: EnumGameState = EnumGameState.Idle;

    constructor() {
        super();
        GameController._instance = this;
    }

    protected start(): void {
        this.registerEvent();
        this.uiController.showIntroUI();
    }

    private registerEvent(): void {
        this.nodeEventEmitter.on(GAME_EVENT.StartGame, this.startGame, this);
    }

    public newGame(): void {
        var mapData = MapUtil.convertJsonToMapData(this.jsonMaps[this.currentLevel]);

        this.uiController.hideIntroUI();
        this.brickContainer.newGame(mapData.map);
        this.paddleController.newGame();
        this.timerController.setTime(mapData.duration);
        this.ballController.selectBall(this.getBallType());
        this.ballController.newGame(mapData.startBallSpeed);
    }

    private getBallType(): BallType {
        if (this.uiSelectBall.isUseSpeedUpBall()) {
            return BallType.SpeedUp;
        } else {
            return BallType.Normal;
        }
    }

    public nextLevel(): void {
        this.currentLevel++;
        if (this.currentLevel >= this.maxLevel) {
            this.currentLevel = 0;
        }
        this.newGame();
    }

    public startGame(): void {
        if (this.enumGameState == EnumGameState.Idle) {
            this.timerController.startTime();
            this.enumGameState = EnumGameState.Playing;
        }
    }

    public gameOver(): void {
        if (this.enumGameState == EnumGameState.Playing) {
            this.ballController.stopMove();
            this.paddleController.gameOver();
            this.enumGameState = EnumGameState.Idle;
            this.uiController.showGameOverUI();
            this.timerController.stopTime();
        }
    }

    public gameFinish(): void {
        this.ballController.stopMove();
        this.enumGameState = EnumGameState.Idle;
        this.uiController.showFinishUI();
        this.timerController.stopTime();
    }

    public ballHitBrick(): void {
        //count point
    }

    public getGameState(): EnumGameState {
        return this.enumGameState;
    }

}
