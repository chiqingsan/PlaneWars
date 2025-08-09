import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {
    @property
    speed:number = 500
    start() {

    }

    update(deltaTime: number) {
        const p1 = this.node.position
        const offsetY = p1.y + deltaTime * this.speed
        this.node.setPosition(p1.x, offsetY)
    }
}


