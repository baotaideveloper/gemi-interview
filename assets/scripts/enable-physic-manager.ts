const { ccclass, property } = cc._decorator;

@ccclass
export default class EnablePhysicsManager extends cc.Component {


    private physicsManager: cc.PhysicsManager;

    protected onLoad(): void {

        this.physicsManager = cc.director.getPhysicsManager();
        this.physicsManager.enabled = true;
    }
}
