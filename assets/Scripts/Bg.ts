import { _decorator, Component, Node, UITransform } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Bg')
export class Bg extends Component {

    @property(Node)
    bg1:Node = null

    @property(Node)
    bg2: Node = null
    
    @property
    speed:number = 150

    private bg1Area?:object
    private bg2Area?: object
    
    screenHeight:number = 850

    start() {
        // const uiTransform1 = this.bg1.getComponent(UITransform)
        // this.bg1Area = uiTransform1
        // const uiTransform2 = this.bg2.getComponent(UITransform)
        // this.bg1Area = uiTransform2

        // this.screenHeight = uiTransform1.height
    }

    update(deltaTime: number) {
        const p1 = this.bg1.position
        const p2 = this.bg2.position
        
        this.bg1.setPosition(
            p1.x,
            p1.y - this.speed * deltaTime,
            p1.z
        )
        this.bg2.setPosition(
            p2.x,
            p2.y - this.speed * deltaTime,
            p2.z
        )

        const newP1 = this.bg1.position
        const newP2 = this.bg2.position

        if (newP1.y <= -this.screenHeight) {
            this.bg1.setPosition(
                newP1.x,
                newP2.y + this.screenHeight,
                newP1.z
            )
        }

        if (newP2.y <= -this.screenHeight) {
            this.bg2.setPosition(
                newP2.x,
                newP1.y + this.screenHeight,
                newP2.z
            )
        }
    }
}


