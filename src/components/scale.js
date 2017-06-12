export default class Scale {

  constructor(element) {
    this.element = element

    element.addEventListener('touchstart', this.touchstart)
    element.addEventListener('mousedown', this.touchstart)
  }


  touchstart(originEvent) {
    let touches = originEvent.touches
    let event = touches.length>0 ? touches[0] : originEvent

    this.startPoints = touches
  }

  touchmove(originEvent) {
    let touches = originEvent.touches
    let event = touches.length>0 ? touches[0] : originEvent

    if (!this.moved) {
      this.moved = true
    } else {

    }

    this.currentPoints = touches
  }

  touchend(originEvent) {
    this.moved = this.startPoints = this.currentPoints = null
  }

  getCenter() {
    let start = this.startPoints
    let curr = this.currentPoints


  }
}
