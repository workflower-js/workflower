import Watch from './watch'
import Curve from './curve'

let cache = {}

export default class Node extends Watch {
  constructor(data, options = {}) {
    super()

    this.data = data
    this.id = data.id
    this.sources = {}
    this.targets = {}
    this.left = 0
    this.top = 0
    this.$element = this.format()
    this.$point = this.$element.getElementsByClassName('workflower-point')[0]
    this.$picture = this.$element.getElementsByClassName('workflower-img')[0]
    this.watchProps()
    this.initEvents()

    if (typeof options.setPicture === 'function') {
      options.setPicture().then(url => {
        this.setPicture(url)
      })
    }
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

  setPicture(url) {
    if (url) {
      this.$picture.src = url
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
    offset.right = offset.left + offset.width
    offset.bottom = offset.top + offset.height

    return offset
  }

  appendTarget(target) {
    let id = target.id

    if (target instanceof Node && !this.targets[id]) {
      this.targets[id] = target
    }
  }

  initEvents() {

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
  renderTo($container) {
    if ($container && typeof $container.appendChild === 'function') {
      // this.$element = this.format()
      $container.appendChild(this.$element)

      this.width = this.$element.offsetWidth
      this.height = this.$element.offsetHeight
    }
  }

  /**
   * 更新节点状态
   * 0: 审批通过
   * 1: 进行中
   * 2: 未通过
   * 3: 未开始
   * 4: 系统自动通过
   */
  updateStatus(status) {
    let point = this.$element.getElementsByClassName('workflower-point')[0]

    // point.className = 'workflower-point status-' + status
  }

  /**
   *
   */
  format() {
    let taskName = ''
    let taskStatus = 0

    if (this.data.taskUserList != null) {
      if (this.data.taskUserList.length > 0) {
        let taskList = this.data.taskUserList

        if (taskList && taskList.length > 0) {
          taskList.forEach((task) => {
            let status = parseInt(task.taskStatus || '0')

            if (taskStatus <= status) {
              taskName = task.assigneeName ?
                `${task.assigneeName}<div style="font-weight: lighter; font-size: 12px; opacity:.6;">(${task.taskName})</div>` :
                task.taskName

              console.log(task.assigneeName)
              if (task.assigneeName) {
                taskStatus = status
              } else {
                taskStatus = 4
              }
            }
          })
        }
      } else if (this.data.taskUserList.length == 0) {
        let dataArr = []

        dataArr[0] = this.data.name

        taskName = dataArr[0]
        taskStatus = dataArr[1]

        if (this.data.id == "startevent1") {
          taskName = "开始"
          taskStatus = 4
        }
      }
    }

    let template = `
      <div class="workflower-node type-${this.data.elementType}" 
            id="node-${this.data.id}" 
            data-id="${this.data.id}">
        <div class="workflower-label">
          <div class="workflower-picture">
            <img class="workflower-img" width="80" data-src="" alt="">
          </div>
          <h4>${taskName}</h4>
        </div>
        <div class="workflower-point status-${taskStatus}"></div> 
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
