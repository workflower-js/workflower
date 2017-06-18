import './main.scss'

import Watch from './components/watch'
import Node from './components/node'
import Curve from './components/curve'

class Workflow extends Watch {

  static ROOTS = 'ROOTS'

  /**
   * @constructor
   * @param options
   */
  constructor(options = {}) {
    super()

    this.options = {
      element: null,
      editable: true,
      gapLength: 40,
      nodes: [],
      padding: '10px',
      getNodeAttributes: (nodeData)=>{ return '' },

      ...options
    }

    this.cache = {}
    this.nodes = {}
    this.lines = {}

    if (this.options.events) {
      this.on(this.options.events)
    }

    this.initBoard()
    this.delegateEvents()
    this.initNodes()
    this.layoutNodes()
    this.drawCurves()
    this.watchNodeOffset()
  }

  /**
   * 初始化画板
   */
  initBoard() {
    let elem = this.options.element

    if (elem) {
      elem.classList.add('workflower')

      elem.innerHTML = `
        <div class="workflower">
          <div class="workflower-board">
            <svg class="workflower-paths"></svg>
          </div>
        </div>`

      this.$element = elem
      this.$board = elem.getElementsByClassName('workflower-board')[0]
      this.$paths = elem.getElementsByClassName('workflower-paths')[0]
    }
  }

  /**
   * 初始化节点
   */
  initNodes() {
    this.options.nodes.forEach(data => {
      let node = this.createNode(data)

      if (node) {
        this.nodes[data.id] = node
        node.renderTo(this.$board)
      }
    })
  }

  /**
   * 点击事件
   */
  delegateEvents() {

    this.on('resize', ()=>{
      this.updateCanvasSize()
    })

    this.$element.addEventListener('click', (event) => {
      let target = event.target

      while (target) {
        if (target.classList && target.classList.contains('workflower-node')) {
          let nodeId = target.getAttribute('data-id')
          let node = this.nodes[nodeId]

          /**
           * @emits {click} 节点点击事件，传入事件函数的参数：event, clickedComponentType == 'node', componentData = nodeData
           */
          this.emit('onNodeClick', event, node)

          /**
           * @emits {click} 全局点击事件，传入事件函数的参数：event, clickedComponentType == 'node', componentData = nodeData
           */
          this.emit('click', event, 'node', node)
          break
        } else {
          target = target.parentNode
        }
      }
    })
  }

  watchNodeOffset() {
    Object.keys(this.nodes).forEach(id => {
      let node = this.nodes[id]

      node.on('layoutChange', (prop, old, val)=>{

        this.updateCureveOfNode(node)

        this.emit('resize')
      })
    })
  }

  createNode(data) {
    let node

    if (parseInt(data.elementType) !== 2) {
      node = this.nodes[data.id] || new Node(data)
    }

    return node
  }

  /**
   * 把 node id 转成 Node 实例
   * @param {String|Node} id
   * @returns {Node}
   */
  resolveNode(id) {
    return typeof id === 'string' ? this.nodes[id] : id
  }

  /**
   * 节点排列
   */
  layoutNodes(nodes, startY = 0, startX = 0) {
    let padding = parseInt(this.options.padding)
    let topCount = startY
    let top = startY
    let left = startX + padding
    let bottom = startY + padding
    let leftOfNextLevel
    let topOfNextLevel

    nodes = nodes || this.getRootNodes()
    if (nodes && nodes instanceof Array) {
      let currentLevelTop = top

      nodes.forEach(node => {
        let targets = this.getTargetNodes(node)

        topOfNextLevel = top
        leftOfNextLevel = left + parseInt(node.width)

        if (targets.length > 0) {
          let childArea = this.layoutNodes(targets, top, leftOfNextLevel)
          let sup_top = childArea.top + ((childArea.bottom - childArea.top) / 2)

          node.top = sup_top
        } else {
          node.top = top
        }

        node.left = left

        topCount = topOfNextLevel
        top += (padding + parseInt(node.height))
      })
    }

    this.emit('resize')

    return {
      top: startY,
      bottom: top,
      left: startX,
      right: left + leftOfNextLevel,
      children: nodes.length
      // childrenGap:
    }
  }

  /**
   * 更新节点的连接线
   * @param {Node} node
   */
  updateCureveOfNode(node) {
    let sourceNodes = this.getSourceNodes(node)
    let targetNodes = this.getTargetNodes(node)
    let point = node.getPoint()

    // 更新入口的连接线
    sourceNodes.forEach(source => {
      let curveId = source.id + '->' + node.id
      let curve = this.lines[curveId]

      curve.endX = point.left
      curve.endY = point.top
    })

    // 更新出口的连接线
    targetNodes.forEach(target => {
      let curveId = node.id + '->' + target.id
      let curve = this.lines[curveId]

      curve.startX = point.left
      curve.startY = point.top
    })
  }

  /**
   * 连线
   */
  drawCurves(nodes) {
    nodes = nodes || this.getRootNodes()

    if (nodes && nodes instanceof Array) {
      nodes.forEach(node => {
        let sourceOffset = node.getPoint()
        let targets = this.getTargetNodes(node)

        sourceOffset.left += sourceOffset.width/2

        targets.forEach(target => {
          let targetOffset = target.getPoint()
          targetOffset.left -= 4
          let curve = new Curve(sourceOffset, targetOffset)
          let path = curve.draw()
          let curveId = node.id + '->' + target.id

          curve.id = curveId
          this.lines[curveId] = curve
          this.$paths.appendChild(path)
        })

        this.drawCurves(targets)
      })
    }
  }

  /**
   * 获取根节点
   */
  getRootNodes() {
    let cache = this.cache[Workflow.ROOTS]

    if (cache) {
      return cache
    } else {
      let roots = []

      Object.keys(this.nodes).forEach(id => {
        let node = this.nodes[id]

        if (parseInt(node.data.elementType) === 0) {
          roots.push(node)
        }
      })

      return this.cache[Workflow.ROOTS] = roots
    }
  }

  /**
   * 获取来源节点
   * @param {String|Node} id
   * @returns {Array<Node>}
   */
  getSourceNodes(id) {
    let node = this.resolveNode(id)
    let list = node.data.incoming || []
    let result = []

    list.forEach(source => {
      let node = this.nodes[source.sourceRef]

      if (node) {
        result.push(node)
      }
    })

    return result
  }

  /**
   * 获取目标节点
   * @param {String|Node} id
   * @returns {Array<Node>}
   */
  getTargetNodes(id) {
    let node = this.resolveNode(id)
    let list = node.data.outgoing || []
    let result = []

    list.forEach(target => {
      let node = this.nodes[target.targetRef]

      if (node) {
        result.push(node)
      }
    })

    return result
  }

  /**
   * 更新画板尺寸大小
   */
  updateCanvasSize() {
    let x = 0
    let y = 0

    Object.keys(this.nodes).forEach(id => {
      let node = this.nodes[id]
      let point = node.getPoint()

      x = Math.max(x, point.right)
      y = Math.max(y, point.bottom)
    })

    this.$board.style.width = x + 'px'
    this.$board.style.height = y + 'px'
  }

  /**
   * 新增节点
   * @param nodeOptions
   */
  appendNode(nodeOptions) {
    let node = nodeOptions instanceof Node ? nodeOptions : this.createNode(nodeOptions)

    if (!this.nodes[node.id]) {
      this.nodes[node.id] = node
      this.$board.appendChild(node.$element)
    }
  }
}

module.exports = exports = Workflow

export default Workflow
