import { _decorator, Component, Node, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
    @property
    speed: number = 850
    
    /**屏幕的高度 */
    screenHeight:number = 0

    start() {
       this.screenHeight = view.getVisibleSize().height;
    }

    update(deltaTime: number) {
        const p1 = this.node.position
        const offsetY = p1.y + deltaTime * this.speed
        this.node.setPosition(p1.x, offsetY)

        if (this.node.worldPosition.y > this.screenHeight + this.screenHeight/10) {
            this.node.destroy()
        }
    }
}


