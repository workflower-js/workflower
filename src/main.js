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
      getNodeAttributes: (nodeData) => { return '' },

      ... options
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

    var nodes = this.options.nodes

    nodes.forEach(data => {
      let node = this.createNode(data)

      this.cache.data = this.cache.data || {}
      this.cache.data[data.id] = data

      if (node) {
        this.nodes[data.id] = node
        node.renderTo(this.$board)
      }
    })

    nodes.forEach(data => {

      let node = this.resolveNode(data.id)

      if (node) {
        node.updateStatus(data.taskUserList.length > 0 ? data.taskUserList[0].taskStatus : '')
      }
    })
  }

  /**
   * 点击事件
   */
  delegateEvents() {
    this.on('resize', () => {
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
          this.emit('contextmenu', event, node)
          break
        } else {
          target = target.parentNode
        }
      }
    })
    //右键
    this.$element.addEventListener('contextmenu', (event) => {
      let target = event.target

      while (target) {
        if (target.classList && target.classList.contains('workflower-node')) {
          let nodeId = target.getAttribute('data-id')
          let node = this.nodes[nodeId]
          this.emit('rightClick', event, node, target)
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

      node.on('layoutChange', (prop, old, val) => {

        this.updateCureveOfNode(node)

        this.emit('resize')
      })
    })
  }

  createNode(data) {
    let node

    node = this.nodes[data.id] || new Node(data)

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
   * 把 数据 id 转成 Data 实例
   * @param {String|Node} id
   * @returns {Node}
   */
  resolveData(id) {
    return typeof id === 'string' ? this.cache.data[id] : id
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

        node.left = Math.max(node.left, left)

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

      if (curve) {
        curve.endX = point.left
        curve.endY = point.top
      }
    })

    // 更新出口的连接线
    targetNodes.forEach(target => {
      let curveId = node.id + '->' + target.id
      let curve = this.lines[curveId]

      if (curve) {
        curve.startX = point.left
        curve.startY = point.top
      }
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

        sourceOffset.left += sourceOffset.width / 2

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
   * 获取来源数据
   * @param {String} id
   * @returns {Array}
   */
  getSourceData(id) {
    let data = this.resolveData(id)
    let list = data.incoming || []
    let result = []

    list.forEach(source => {
      let data = this.cache.data[source.sourceRef]

      if (data) {
        result.push(data)
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
   * 获取目标数据
   * @param {String} id
   * @returns {Array}
   */
  getTargetData(id) {
    let data = this.resolveData(id)
    let list = data.outgoing || []
    let result = []

    list.forEach(target => {
      let data = this.cache.data[target.targetRef]

      if (data) {
        result.push(data)
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
    console.log(node)

    //this.cache.data[node.id] = nodeOptions
    if (!this.nodes[node.id]) {
      this.nodes[node.id] = node
      this.$board.appendChild(node.$element)
    }
  }

  //右键菜单
  menu(event, menu) {
    event.preventDefault();
    var x = event.clientX + 'px';
    var y = event.clientY + 'px';
    var menu = document.querySelector('#menu');
    menu.style.left = x;
    menu.style.top = y;
    menu.style.width = 130 + 'px';
    menu.style.display = 'block'
  }

  //添加具体元素
  addNode(node, jsonData, clickCount) {

    let i = 0;
    let currentId = node.$element.id.slice(5);
    var nextNodeId = node.$element.nextElementSibling.id.slice(5);

    jsonData.forEach((value, index) => {

      if (value.id == currentId) {
        i = index
        nextNodeId = value.outgoing[0].targetRef
        value.outgoing[0].targetRef = "editable" + clickCount

        jsonData.forEach((value, index) => {
          if (value.id == nextNodeId) {
            value.incoming[0].sourceRef = "editable" + clickCount
          }
        })
      }
    })

    const data = {

      "taskUserList": [{
        "taskId": "",
        "formKey": "",
        "businessKey": "",
        "assignee": "",
        "taskKey": "editable" + clickCount,
        "endTime": null,
        "taskName": "editable" + clickCount,
        "variables": null,
        "startTime": null,
        "activitiId": "",
        "businessTitle": "",
        "taskStatus": "2",
        "processInstanceId": "",
        "companyId": "",
        "comment": ""
      }],
      "id": "editable" + clickCount,
      "incoming": [{
        "id": "flow" + (clickCount + 7),
        "targetRef": "editable" + clickCount,
        "sourceRef": currentId
      }],
      "processInstanceId": "",
      "businessKey": "",
      "outgoing": [{
        "id": "flow" + (clickCount + 8),
        "targetRef": nextNodeId,
        "sourceRef": "editable" + clickCount
      }],
      "elementType": "1",
      "procDefId": ""

    }

    this.appendNode(data)

    jsonData.splice(i + 1, 0, data)
    console.log(jsonData)
    this.refresh()

  }

  //删除节点
  deleteNode(node, jsonData, clickCount) {

    let i = 0;
    let currentId = node.$element.id.slice(5);

    let nextNodeId;
    let prevNodeId;
    let currentNode = node.$element
    let nextNode = node.$element.nextElementSibling
    let prevNode = node.$element.previousElementSiblingSibling

    jsonData.forEach((value, index) => {

      if (value.id == currentId) {

        i = index;
        //前节点ID
        prevNodeId = value.incoming[0].sourceRef;
        //后节点ID
        nextNodeId = value.outgoing[0].targetRef;
        if (nextNodeId.indexOf("0") == -1) {
          console.log("删除下级节点")
          this.deleteUnderlingNode(jsonData, prevNodeId, currentId, nextNodeId)
        } else {
          console.log("删除同级分支")

          jsonData.forEach((value, index) => {
            //对后节点进行修改
            if (value.id == nextNodeId) {
              value.incoming.forEach((value6, index6) => {
                if (value6.sourceRef == currentId) {
                  value.incoming.splice(index6, 1)
                }
                if (value6.sourceRef == prevNodeId) {
                  value.incoming.splice(index6, 1)
                }
              })

              if (value.incoming.length == 0) {
                value.incoming.push({id: "flow" + (clickCount + 9), sourceRef: prevNodeId, targetRef: nextNodeId})
                value.incoming[0].sourceRef == prevNodeId

              }
            }
            //对前节点进行修改
            if (value.id == prevNodeId) {

              value.outgoing.forEach((value1, index1) => {
                //删除同级分支
                if (value1.targetRef == currentId) {

                  value.outgoing.splice(index1, 1)

                  //当同级分支只剩下一个时,自动转换为下级节点
                  if (value.outgoing.length == 2) {


                    //当节点仅为一个时,就将节点集合删除
                    if (nextNodeId.indexOf("0") != -1) {

                    }

                  } else if (value.outgoing.length == 1 && value.incoming.length == 0) {

                    value.outgoing.push({id: "flow" + (clickCount + 10), sourceRef: prevNodeId, targetRef: nextNodeId})

                  } else if (value.outgoing.length == 0) {
                    value.outgoing.push({id: "flow" + (clickCount + 11), sourceRef: prevNodeId, targetRef: nextNodeId})
                  }
                }

              })
            }
          })
        }

      }

    })

    this.nodes[nextNodeId].left = parseInt(currentNode.style.left)
    this.nodes[nextNodeId].top = parseInt(currentNode.style.top)
    jsonData.splice(i, 1)
    this.refresh()
  }

  //删除下级节点
  deleteUnderlingNode(jsonData, prevNodeId, currentId, nextNodeId) {
    jsonData.forEach((value, index) => {
      if (value.id == nextNodeId) {
        value.incoming[0].sourceRef = prevNodeId;
      }

      if (value.id == prevNodeId) {
        value.outgoing.forEach((value, index) => {

          if (value.targetRef == currentId) {

            value.targetRef = nextNodeId;
          }
        })
      }

    })
  }

  //添加分支
  addBranch(node, jsonData, clickCount) {
    let i = 0;
    let currentId = node.$element.id.slice(5);

    let nextNodeId;
    let prevNodeId;
    let data = {}//数据模板
    let nodeGroup = {}//节点集合

    let nodesArr = []

    jsonData.forEach((value, index) => {

      if (value.id == currentId) {

        i = index
        //前节点ID
        prevNodeId = value.incoming[0].sourceRef
        //后节点ID
        nextNodeId = value.outgoing[0].targetRef

        data = {

          "taskUserList": [{
            "taskId": "",
            "formKey": "",
            "businessKey": "",
            "assignee": "",
            "taskKey": "editable" + clickCount,
            "endTime": null,
            "taskName": "editable" + clickCount,
            "variables": null,
            "startTime": null,
            "activitiId": "",
            "businessTitle": "",
            "taskStatus": "2",
            "processInstanceId": "",
            "companyId": "",
            "comment": ""
          }],
          "id": "editable" + clickCount,
          "incoming": [{
            "id": "flow9",
            "targetRef": "editable" + clickCount,
            "sourceRef": prevNodeId
          }],
          "processInstanceId": "",
          "businessKey": "",
          "outgoing": [{
            "id": "flow10",
            "targetRef": "editable0" + clickCount,
            "sourceRef": "editable" + clickCount
          }],
          "elementType": "1",
          "procDefId": "",
          "approver": ""

        }
        if (nextNodeId.indexOf("0") == -1) {
          value.outgoing[0].targetRef = "editable0" + clickCount
        } else {
          jsonData.forEach((v) => {
            if (v.id == nextNodeId) {

              value.outgoing[0].targetRef = nextNodeId
              data.outgoing[0].targetRef = nextNodeId

            }
          })

        }

        //遍历this.options.nodes
        jsonData.forEach((value, index) => {

          //设置后节点的incoming
          if (value.id == nextNodeId) {

            console.log(value)
            console.log()
            let incomingData = {
              id: "flow" + clickCount,
              sourceRef: "editable" + clickCount,
              targetRef: "editable0" + clickCount
            }

            //深拷贝对象
            nodeGroup = this.deepCopy(data)

            nodeGroup.incoming = value.incoming;
            nodeGroup.incoming.push(incomingData)

            nodeGroup.taskUserList[0]["taskName"] = "节点集合0" + clickCount
            nodeGroup.id = nodeGroup.taskUserList[0]["taskKey"] = "editable0" + clickCount;
            nodeGroup.elementType = 4

            nodeGroup.incoming.forEach((value) => {

              value.targetRef = "editable0" + clickCount;
            })

            nodeGroup.outgoing = [{id: "flow10", sourceRef: "editable0" + clickCount, targetRef: nextNodeId}]

            if (nextNodeId.indexOf("0") == -1) {
              value.incoming = [{id: "flow" + clickCount, sourceRef: "editable0" + clickCount, targetRef: nextNodeId}]
            }

          }
          //设置前节点的outgoing
          if (value.id == prevNodeId) {

            var outgoingData = {id: "flow" + clickCount, sourceRef: prevNodeId, targetRef: "editable" + clickCount}
            value.outgoing.push(outgoingData)

          }
        })

      }

    })

    jsonData.splice(i + 1, 0, data)
    //如果后节点是网关不必再添加网关
    if (nextNodeId.indexOf("0") == -1) {
      jsonData.splice(i + 1, 0, nodeGroup)
    }
    console.log(nodeGroup)
    console.log(jsonData)
    this.refresh()
  }

  //刷新初始化
  refresh() {
    this.initBoard()
    this.initNodes()
    this.layoutNodes()
    this.drawCurves()
    this.watchNodeOffset()
  }

  //修改属性
  modifyAttr(node, jsonData) {
    let currentId = node.$element.id.slice(5);

    var textList = document.querySelector('#textlist');

    textList.style.display = 'block'

    document.getElementById("confirm1").onclick = () => {
      var inputText = document.getElementById("name").value
      jsonData.forEach((value, index) => {
        if (value.id == currentId) {
          value.taskUserList.forEach((value, index) => {

            if (confirm("是否要更改审批人")) {
              value.assigneeName = inputText;
            }
            inputText = ""
          })
          inputText = ""
        }

      })

      textList.style.display = 'none'
    }
  }

  //深拷贝
  deepCopy(source) {
    var result;
    (source instanceof Array) ? (result = []) : (result = {});

    for (var key in source) {
      result[key] = (typeof source[key] === 'object') ? this.deepCopy(source[key]) : source[key];
    }
    return result;
  }
}

module.exports = exports = Workflow

export default Workflow
