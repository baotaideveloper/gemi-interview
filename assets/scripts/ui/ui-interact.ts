const { ccclass, property } = cc._decorator;

@ccclass
export default class UIInteract extends cc.Component {
    @property(cc.Node)
    private targetNode: cc.Node = null;

    public show(): void {
        this.targetNode.active = true;
    }

    public hide(): void {
        this.targetNode.active = false;
    }
}