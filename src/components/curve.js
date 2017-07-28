import Watch from './watch'

export default class Curve extends Watch {
  constructor(start, end, offset = 0) {
    super()

    this.canvasOffset = offset
    this.startX = start.x || start.left
    this.startY = start.y || start.top
    this.endX = end.x || end.left
    this.endY = end.y || end.top

    let watcher = () => {
      this.update()
      
    }

    this.draw()
    this.watch('canvasOffset', watcher)
    this.watch('startX', watcher)
    this.watch('startY', watcher)
    this.watch('endX', watcher)
    this.watch('endY', watcher)
  }

  /** Curve
   *  calculate the path curve
   * @returns {string}
   */
  static curve (startX, startY, endX, endY, offset = {left:0, top:0}) {
    let x1 = startX
    let y1 = startY
    let x2 = endX
    let y2 = endY
    let d

    x1 -= offset.left
    y1 -= offset.top
    x2 -= offset.left
    y2 -= offset.top

    d = Math.abs(x1-x2) / 2
    y1 += 5
    y2 += 5

    return  " M" +  x1      + "," + y1 +      // start
      " C" + (x1 + d) + "," + y1 +      // control 1
      " "  + (x2 - d) + "," + y2 +      // control 2
      " "  + x2       + "," + y2 +      // end
      " "  + "l-1 0 l-5 -5 m5 5 l-5 5" // arrow
  }

  /** Draw Path
   *
   * @param p1
   * @param p2
   * @returns {Element}
   */
  draw () {
    let curve = Curve.curve(
      this.startX,
      this.startY,
      this.endX,
      this.endY
    )

    this.path = this.path || document.createElementNS('http://www.w3.org/2000/svg', 'path')
    this.path.setAttribute('d', curve)

    return this.path
  }

  /**
   *
   */
  update() {
    let curve = Curve.curve(
      this.startX,
      this.startY,
      this.endX,
      this.endY
    )

    this.path.setAttribute('d', curve)
  }
}
