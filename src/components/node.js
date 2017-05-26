import Watch from './watch'
import Curve from './curve'

let cache = {}

export default class Node extends Watch {
  constructor(data) {
    super()

    this.data = data
    this.id = data.id
    this.sources = {}
    this.targets = {}
    this.left = 0
    this.top = 0
    this.$element = this.format()
    this.$point = this.$element.getElementsByClassName('workflower-point')[0]
    this.watchProps()
    this.initEvents()
  }

  static getNodeById(id) {
    return cache[id]
  }

  appendSource(source) {
    let id = target.id

    if (source instanceof Node && !this.sources[id]) {
      this.sources[id] = source
    }
  }

  getPoint() {
    let offset = {left: 0, top: 0}
    let width = this.$point.offsetWidth / 2
    let height = this.$point.offsetHeight / 2

    offset.width = width
    offset.height = height
    offset.left = this.$point.offsetLeft + parseInt(this.left)
    offset.top = this.$point.offsetTop + parseInt(this.top) + height


    return offset
  }

  appendTarget(target) {
    let id = target.id

    if (target instanceof Node && !this.targets[id]) {
      this.targets[id] = target
    }
  }

  initEvents() {
    this.on({
      'offsetUpdate': () => {

      }
    })
  }

  /**
   * 监控属性
   */
  watchProps() {
    let style = this.$element.style
    let handler = (prop, old, val) => {
      style[prop] = this[prop] + 'px';

      this.emit('layoutChange', prop, old, val)
    }

    this.watch('left', handler)
    this.watch('top', handler)
    this.watch('width', handler)
    this.watch('height', handler)
  }

  /**
   * 渲染到指定容器内
   * @param $container
   */
  renderTo ($container) {
    if ($container && typeof $container.appendChild === 'function') {
      $container.appendChild(this.$element)

      this.width = this.$element.offsetWidth
      this.height = this.$element.offsetHeight
    }
  }

  /**
   *
   */
  format () {
    let taskList = this.data.taskUserList
    let taskName = (taskList && taskList.length > 0) ? taskList[0].taskName : ''

    let taskStatus = (taskList && taskList.length > 0) ? taskList[0].taskStatus : ''

    let template = `
      <div class="workflower-node type-${this.data.elementType}" id="node-${this.data.id}" data-id="${this.data.id}">
      
        <div class="workflower-label">
          <div class="workflower-picture">
            <img width="80" src="https://cn.vuejs.org/images/logo.png" alt="">
          </div>
          <h4>${taskName}</h4>
        </div>
        <div class="workflower-point status-${taskStatus}"></div>
        
      
        <!--<div class="workflower-inputs">-->
          <!--<span class="workflower-point"></span>-->
        <!--</div>-->
        <!---->
        <!--<div class="workflower-outputs">-->
          <!--<span class="workflower-point"></span>-->
        <!--</div>-->
        
      </div>`

    let wrapper = document.createElement('div')
        wrapper.innerHTML = template

    try {
      return wrapper.firstElementChild
    } finally {
      wrapper = template = null
    }
  }

  /**
   * 从此节点连接到目标节点
   */
  connectTo(target) {
    let curve = new Curve()
  }
}
