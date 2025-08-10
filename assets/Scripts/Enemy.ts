import { _decorator, Animation, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Enemy')
export class Enemy extends Component {


    /**击中销毁动画 */
    @property(Animation)
    anim: Animation = null

    /**敌人的移动速度 */
    @property
    speed:number = 300

    start() {
        // this.anim.play()
    }

    update(deltaTime: number) {
        const p = this.node.position
        this.node.setPosition(
            p.x,
            p.y - deltaTime * this.speed,
            p.z
        )
    }
}


