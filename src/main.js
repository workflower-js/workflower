import './main.scss'

import Watch from './components/watch'
import Node from './components/node'
import Curve from './components/curve'
import axios from 'axios'

axios.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';

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

    let date = new Date().getTime();
    let elem = this.options.element;
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
    //右键菜单
    let RightClickHtml = document.createElement("div")
    RightClickHtml.innerHTML = `<div id="menu">
    	<p id="deleteNode">删除节点</p>
    	<p id="addNode">增加下级节点</p>
    	<p id="addBranch">增加同级分支</p>
    	<p id="modifyAttr">修改属性</p>
    	<p id="setAssign">设置审批人</p>
    </div>`

    let attrText = document.createElement("form")
    attrText.id = "textlist"
    attrText.innerHTML = `
    	<input type="text" name="nodeName" id="nodeName" placeholder="设置节点名称"/>
    	<a style="display: block;width: 100px;height: 40px;background: #ddd;line-height: 40px;text-align: center;margin: 20px auto;" id="confirm1">确认</a>`

    let assigner = document.createElement("div")
    assigner.id = 'dialog-form'

    assigner.innerHTML = `<div><p class="assignText">指定审批人</p></div>

   	<div class="buttonContainer"><button id="save3" class="ui-button" style="float:left">保存</button>
   	<button id="cancel3" class="ui-button" style="float:right">取消</button></div>
   	`
    if (navigator.userAgent.match(/DingTalk/)) {
      assigner.style.display = 'none'
    }

    this.$element.appendChild(assigner)
    this.$element.appendChild(RightClickHtml)
    this.$element.appendChild(attrText)

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

      // if (node) {
      //   node.updateStatus(data.taskUserList.length > 0 ? data.taskUserList[0].taskStatus : '')
      // }
    })

  }

  /**
   * 点击事件
   */
  delegateEvents() {
    //数据模板
    let dataTemplate = {
      "endEvent": {},
      "exclusiveGatewayList": [],
      "flowList": [],
      "parGateWayList": [],
      "processId": "",
      "processName": "",
      "startEvent": {},
      "usertaskList": []
    }
    let clickCount = 0;
    let idArray = [];
    let i = 0;

    //获取已存在的clickout值，并取出其中最大值
    this.options.nodes.forEach((value, index) => {
      idArray.push((value.id).replace(/[^0-9]/ig, ""))

    })
    Array.prototype.max = function () {
      return Math.max.apply({}, this)
    }
    clickCount = idArray.max()

    this.on('resize', () => {
      this.updateCanvasSize()
    })

    if (document.getElementById("save")) {
      //保存
      document.getElementById("save").onclick = () => {

        this.createData(dataTemplate)

        this.sendData(dataTemplate, clickCount)
      }
    }

    if (document.getElementById("save2")) {
      //编辑
      document.getElementById("save2").onclick = () => {

        this.createData(dataTemplate)
        this.sendData(dataTemplate, clickCount)
      }
    }

    this.$element.addEventListener('click', (event) => {
      let target = event.target

      this.menuHide()
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
    //右键
    this.$element.addEventListener('contextmenu', (event) => {
      let target = event.target
      while (target) {
        if (target.classList && target.classList.contains('workflower-node')) {
          let nodeId = target.getAttribute('data-id')
          let node = this.nodes[nodeId]

          this.emit('contextmenu', event, node, target)
          this.emit('rightClick', event, node, target)

          let currentId = node.$element.id.slice(5);
          let nextNodeId;
          let prevNodeId;

          //右键行为
          this.menu(event, "menu", node)

          //添加下级节点
          document.getElementById("addNode").onclick = () => {
            clickCount++

            this.addNode(node, this.options.nodes, clickCount, currentId, prevNodeId, nextNodeId)
          }
          //添加同级分支
          document.getElementById("addBranch").onclick = () => {
            clickCount++

            this.addBranch(node, this.options.nodes, clickCount, currentId, prevNodeId, nextNodeId)
          }
          //删除元素
          document.getElementById("deleteNode").onclick = () => {
            this.deleteNode(node, this.options.nodes, clickCount, i, currentId, prevNodeId, nextNodeId)
          }
          //修改属性
          document.getElementById("modifyAttr").onclick = () => {

            this.emit('modifyAttr', node, this.options.nodes, dataTemplate)
            this.modifyAttr(node, this.options.nodes, dataTemplate, currentId, prevNodeId, nextNodeId)
            this.createData(dataTemplate, currentId, prevNodeId, nextNodeId)
          }

          //设置审批人
          document.getElementById("setAssign").onclick = () => {

            this.emit("setAssign", node, this.options.nodes, dataTemplate)
            this.setAssign(node, this.options.nodes, dataTemplate, currentId, prevNodeId, nextNodeId)
            this.createData(dataTemplate, currentId, prevNodeId, nextNodeId)
          }

          break
        } else {
          target = target.parentNode
        }

      }

    })

  }

  addUser() {
    let list = document.querySelector("#list")
    let listNode = document.createElement("select");
    list.style.display = 'block'
    let select = list.getElementsByTagName("select")

    if (select.length <= 0) {

      axios.get('/userRole/queryAuthUsers').then(function (res) {

        let userData = res.data.data

        userData.forEach((value, index) => {

          listNode.innerHTML += `<option value =${value.userName}>${value.userName}</option>`

          document.getElementById("list").appendChild(listNode)

        })
      }).catch(function (err) {

      })

    }

  }

  //制作数据模板
  createData(dataTemplate, currentId, prevNodeId, nextNodeId) {

    this.options.nodes.forEach((value, index) => {

      value.incoming.forEach((value, index) => {

        dataTemplate.flowList.push(value)
      })
      value.outgoing.forEach((value, index) => {

        dataTemplate.flowList.push(value)

      })
      this.unique(dataTemplate.flowList)

      if (value.elementType == 0) {
        dataTemplate.startEvent.id = value.id
      } else if (value.elementType == 2) {
        dataTemplate.endEvent.id = value.id
      } else if (value.elementType == 3) {
        dataTemplate.exclusiveGatewayList.push({"id": value.id, "name": value.id})
        this.unique1(dataTemplate.exclusiveGatewayList)
      } else {

        dataTemplate.usertaskList.push({
          "assignee": [],
          "charInfo": {
            "condition": "",
            "userTaskId": "",
            "completionCondition": "",
            "elementVariable": "assignee",
            "sequential": "false",
            "inputDataItem": ""
          },
          "id": value.id,
          "name": value.name || value.id,

        })
      }
      this.unique1(dataTemplate.usertaskList)
    })

    let workflowerName = document.getElementById("workflowerName").value;
    let key = new Date().getTime();
    if (localStorage.getItem('wfkey')) {
      dataTemplate.businessKey = localStorage.getItem('wfkey');
    } else {
      dataTemplate.businessKey = key;
    }

    if (workflowerName == "") {
      dataTemplate.processId = localStorage.getItem('wfkey') || this.$element.id;
      dataTemplate.processName = this.$element.id
    } else {
      dataTemplate.processId = localStorage.getItem('wfkey') || "wf" + key;
      dataTemplate.processName = workflowerName;
    }
    console.log(dataTemplate)
    return dataTemplate

  }

  //sendData
  sendData(dataTemplate, clickCount) {

    dataTemplate.flowList.forEach((value, index) => {
      console.log(value.targetRef)
      if (value.targetRef == "endevent1" && value.sourceRef == "editable1") {
        dataTemplate.flowList.splice(index, 1)
      }
    })

    axios.post('/bpmn/produceBpmnJson', dataTemplate).then(function (res) {
      if (res.data.status == 200) {
        alert('保存成功')
        window.history.go(-1)
      } else {
        alert('保存失败')
      }
    })
  }

  //初始化命名
  formateNodeName(node, jsonData, currentId, prevNodeId, nextNodeId) {

    let children = node.$element.children[0].children[1];
    jsonData.forEach((value, index) => {
      if (value.id == currentId) {

        document.getElementById("nodeName").value = value.name || value.id
        children.innerHTML = value.name || value.id
      }

    })
  }

  //修改属性
  modifyAttr(node, jsonData, dataTemplate, currentId, prevNodeId, nextNodeId) {

    let children = node.$element.children[0].children[1];
    var textList = document.querySelector('#textlist');

    //回填功能
    let num = currentId.replace(/[^0-9]/ig, "");
    num -= 1

    document.getElementById("nodeNameContainer").appendChild(document.getElementById("nodeName"))

    this.remove('#nodeNameContainer', "#nodeName", 1, document.getElementById("nodeNameContainer").children.length - 1)

    jsonData.forEach((value, index) => {
      if (value.id == currentId) {

        document.getElementById("nodeName").value = value.name || value.id
        children.innerHTML = value.name || value.id
      }

    })

    //点击保存按钮
    document.getElementById("confirm1").onclick = () => {

      let nodeName = document.getElementById("nodeName").value;

      jsonData.forEach((value, index) => {
        if (value.id == currentId) {

          dataTemplate.usertaskList.forEach((value1, index1) => {

            if (value1.id == currentId) {

              if (nodeName == "") {
                alert("请输入内容")
              } else {

                value.name = nodeName;
                children.innerHTML = nodeName;
                value1.name = nodeName

              }
            }

          })

        }

      })

    }
    this.menuHide()
    dataTemplate.flowList.forEach((value, index) => {
      if (value.sourceRef == "editable02" && value.targetRef == "endevent1" && "editable02".targetRef != "endevent1") {
        dataTemplate.flowList.splice(index, 1)
      }
    })

  }

  //设置审批人
  setAssign(node, jsonData, dataTemplate, currentId, prevNodeId, nextNodeId) {

    var dialogForm = document.querySelector('#dialog-form');
    //获取checked的value
    let radio = document.getElementsByName("radio");

    let selectvalue = null;   //  selectvalue为radio中选中的值

    for (var i = 0; i < radio.length; i++) {

      if (radio[i].checked == true) {

        selectvalue = radio[i].value;

        break;
      }
    }

    //回填审批人
    setTimeout(function () {
      let assigneeDatas;

      dataTemplate.usertaskList.forEach((value, index) => {
        //回填radio
        if (value.id == currentId) {

          if (value.charInfo.condition == "${nrOfInstances-nrOfCompletedInstances==0}") {

            selectvalue = "many"
          } else if (value.charInfo.condition == "${nrOfInstances-nrOfCompletedInstances==(nrOfInstances-1)}") {

            selectvalue = "one"
          } else {

            selectvalue = "onlyone"

          }
          //将selectvalue的值转换为选中的radio
          for (var i = 0; i < radio.length; i++) {

            if (selectvalue == radio[i].value) {

              radio[i].checked = true

              break;
            }
          }
        }

        if (value.assignee.length == 0) {
          assigneeDatas = jsonData
        } else {
          assigneeDatas = dataTemplate.usertaskList
        }
      })

      //将jsonData数据添加到dataTemplate
      jsonData.forEach((value, index) => {
        dataTemplate.usertaskList.forEach((value1, index1) => {
          if (value1.id == value.id) {

            if (value.taskUserList && value.taskUserList.length > 0) {
              if (value.taskUserList[0].assigneeUsers && value.taskUserList[0].assigneeUsers.length > 0) {

                value1.assignee = value.taskUserList[0].assigneeUsers
              } else if (value.taskUserList[0].assignee != "") {

                value1.assignee.push(value.taskUserList[0].assignee)
              }
            }
          }

        })
      })
      assigneeDatas.forEach((value, index) => {
        if (value.id == currentId) {

          let assignerData = []
          let assignerDataEdit = []

          if (value.taskUserList && value.taskUserList.length > 0) {
            if (!value.taskUserList[0].assigneeUsers || value.taskUserList[0].assigneeUsers.length == 0) {
              assignerDataEdit.push(value.taskUserList[0].assignee)
            } else {
              assignerDataEdit = value.taskUserList[0].assigneeUsers
            }
          }
          assignerData = value.assignee || assignerDataEdit
          //去重
          let data = [];
          let json1 = {};
          for (var i = 0; i < assignerData.length; i++) {
            if (!json1[assignerData[i]]) {
              data.push(assignerData[i]);
              json1[assignerData[i]] = 1;
            }
          }
          assignerData = data

          $(".select2-selection__rendered").empty();
          assignerData.forEach((value2, index2) => {

            document.getElementsByClassName("select2-selection__rendered")[0].innerHTML = ""
            if (value2 != []) {
              $.get('/userCenter/getUserDetailInfo?id=' + value2, function (json) {

                let inputTemplate = document.createElement("li")
                inputTemplate.className = "select2-selection__choice"
                inputTemplate.title = json.data.userName

                inputTemplate.innerHTML = `<span class="select2-selection__choice__remove" role="presentation">×</span>${json.data.userName}`
                document.getElementsByClassName("select2-selection__rendered")[0].appendChild(inputTemplate)
                document.getElementById("assigneeName").value = json.data.userName

              })
            }

          })
        }

      })
    }, 1)

    setTimeout(function () {
      $("#assigneeName").val(null).trigger("change");
    }, 2)
    //设置委托人时的保存
    document.getElementById("save3").onclick = () => {

      let assigneeName = document.getElementById("assigneeName").value;

      jsonData.forEach((value, index) => {
        if (value.id == currentId) {

          dataTemplate.usertaskList.forEach((value1, index1) => {

            if (value1.id == currentId) {

              if (assigneeName == "") {
                alert("请输入内容")
              } else {

                let liLength = Array.prototype.slice.call(document.getElementsByClassName("select2-selection__rendered")[0].children).length;

                if (liLength == 1) {
                  value1.assignee.push(assigneeName);
                } else if (liLength >= 2) {

                  Array.prototype.slice.call(document.getElementsByClassName("select2-selection__rendered")[0].children).forEach((value, index) => {
                    if (value.title != "") {
                      //获取用户
                      $.get('/userRole/queryAuthUsers', function (json) {

                        json.data.forEach((value2, index2) => {
                          if (value2.userName == value.title) {
                            //通过用户ID获取用户详细信息，并将其回填到输入框中
                            $.get('/userCenter/getUserDetailInfo?id=' + value2.id, function (data) {
                              let inputTemplate = document.createElement("li")
                              inputTemplate.className = "select2-selection__choice"
                              inputTemplate.title = json.data.userName

                              inputTemplate.innerHTML = `<span class="select2-selection__choice__remove" role="presentation">×</span>${json.data.userName}`
                              document.getElementsByClassName("select2-selection__rendered")[0].appendChild(inputTemplate)
                            })

                            //去重
                            value1.assignee.push(value2.id)

                            var res = [];
                            var json = {};
                            for (var i = 0; i < value1.assignee.length; i++) {
                              if (!json[value1.assignee[i]]) {
                                res.push(value1.assignee[i]);
                                json[value1.assignee[i]] = 1;
                              }
                            }
                            value1.assignee = res
                            for (var i = 0; i < radio.length; i++) {

                              if (radio[i].checked == true) {

                                selectvalue = radio[i].value;

                                break;
                              }
                            }
                            console.log(value1)
                            console.log(selectvalue)

                            //全部通过才通过
                            if (selectvalue == "many") {
                              value1.charInfo.condition = value1.charInfo.completionCondition = "${nrOfInstances-nrOfCompletedInstances==0}"

                              value1.charInfo.inputDataItem = "${assigneeList}"
                              //一人通过即通过
                            } else if (selectvalue == "one") {

                              value1.charInfo.condition = value1.charInfo.completionCondition = "${nrOfInstances-nrOfCompletedInstances==(nrOfInstances-1)}"

                              value1.charInfo.inputDataItem = "${assigneeList}"
                            } else {
                              value1.charInfo.condition = value1.charInfo.completionCondition = ""
                              value1.charInfo.sequential = "true"
                            }

                          }
                        })
                      })
                    }

                  })
                }

              }

            }

          })

        }

      })
    }

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
    let node = this.nodes[data.id] || new Node(data)
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
    //this.cache.data[node.id] = nodeOptions
    if (!this.nodes[node.id]) {
      this.nodes[node.id] = node
      this.$board.appendChild(node.$element)
    }
  }

  //右键菜单
  menu(event, menu, node) {
    event.preventDefault();

    //网关只需要有增加下级节点
    document.getElementById("menu").children[2].style.display = (this.nodes[node.$element.id.slice(5)].data.elementType == 3) ? "none" : "block"
    document.getElementById("menu").children[0].style.display = (this.nodes[node.$element.id.slice(5)].data.elementType == 3) ? "none" : "block"
    document.getElementById("menu").children[3].style.display = (this.nodes[node.$element.id.slice(5)].data.elementType == 3) ? "none" : "block"
    document.getElementById("menu").children[4].style.display = (this.nodes[node.$element.id.slice(5)].data.elementType == 3) ? "none" : "block"
    //若不是网关，但outgoing为两个的话或该节点是开始节点和结束节点，都不能直接删除该节点
    if (this.nodes[node.$element.id.slice(5)].data.elementType != 3 && this.nodes[node.$element.id.slice(5)].data.outgoing.length >= 2 || this.nodes[node.$element.id.slice(5)].data.id == "startevent1" || this.nodes[node.$element.id.slice(5)].data.id == "endevent1") {
      document.getElementById("menu").children[0].style.display = "none"
    }

    let x = (event.pageX - 260) + 'px';
    let y = (event.pageY - 288) + 'px';
    var menu = document.querySelector('#menu');
    menu.style.left = x;
    menu.style.top = y;
    menu.style.width = 130 + 'px';
    menu.style.display = 'block';

  }

  //添加具体元素
  addNode(node, jsonData, clickCount, currentId, prevNodeId, nextNodeId) {

    let i = 0;
    jsonData.forEach((value, index) => {
      value.incoming.forEach((value1, index) => {
        if (value1.sourceRef == currentId) {

          nextNodeId = value.id

        }
      })
      value.outgoing.forEach((value1, index) => {
        if (value1.targetRef == currentId) {
          prevNodeId = value.id

        }
      })

    })

    jsonData.forEach((value, index) => {

      if (value.id == currentId) {

        i = index
        nextNodeId = value.outgoing[0].targetRef
        value.outgoing[0].targetRef = "editable" + clickCount

        jsonData.forEach((value, index) => {
          if (value.id == nextNodeId) {

            value.incoming.forEach((value1, index) => {

              if (value1.sourceRef == currentId) {
                if (value1.targetRef == nextNodeId) {
                  value.incoming[index] = {
                    "id": "flow" + (clickCount + 40),
                    "sourceRef": "editable" + clickCount,
                    "targetRef": nextNodeId
                  }
                } else {
                  value.incoming[index] = {
                    "id": "flow" + (clickCount + 40),
                    "sourceRef": "editable" + clickCount,
                    "targetRef": "editable0" + clickCount
                  }
                }

              }
            })

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
        "id": "flow" + (clickCount + 50),
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
    this.menuHide()

  }

  //删除节点
  deleteNode(node, jsonData, clickCount, i, currentId, prevNodeId, nextNodeId) {

    let currentNode = node.$element;

    jsonData.forEach((value, index) => {

      if (value.id == currentId) {
        i = index;
        //前节点ID
        prevNodeId = value.incoming[0].sourceRef;
        //后节点ID
        nextNodeId = value.outgoing[0].targetRef;
        //判断是删除下级节点还是同级分支
        if (nextNodeId.indexOf("0") == -1) {
          //删除下级节点
          this.deleteUnderlingNode(jsonData, currentId, prevNodeId, nextNodeId)
        } else {
          //删除同级分支
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

              //当节点仅为一个时,就将节点集合删除
              if (value.incoming.length == 1) {

                if (value.id.indexOf("0") != -1) {
                  jsonData.forEach((value7, index7) => {
                    if (value.id == value7.id) {

                      jsonData.forEach((value, index) => {
                        //修改前方节点的outgoing
                        if (value.id == value7.incoming[0].sourceRef) {
                          value.outgoing = value7.outgoing
                          value.outgoing.forEach((value, index) => {
                            value.sourceRef = value7.incoming[0].sourceRef
                          })

                        }
                        //修改后方节点的incoming
                        value7.outgoing.forEach((value8, index8) => {
                          if (value.id == value8.targetRef) {
                            value.incoming[0].sourceRef = value7.incoming[0].sourceRef
                          }
                        })

                      })

                      jsonData.splice(index7, 1)

                    }
                  })
                }
              }
              if (value.incoming.length == 0) {
                value.incoming.push({id: "flow" + (clickCount + 9), sourceRef: prevNodeId, targetRef: nextNodeId})
                value.incoming[0].sourceRef == prevNodeId

              }
            }
            //对前节点进行修改
            if (value.id == prevNodeId) {

              value.outgoing.forEach((value1, index1) => {

                if (localStorage.getItem('title') == "新建") {
                  if (value1.id == "flow18") {
                    value.outgoing.splice(index1, 1)
                  }
                }

                //删除同级分支
                if (value1.targetRef == currentId) {

                  value.outgoing.splice(index1, 1)
                  //当同级分支只剩下一个时,自动转换为下级节点
                  if (value.outgoing.length == 2) {

                  } else if (value.outgoing.length == 1 && value.incoming.length == 0) {
                    document.getElementById("menu").children[0].style.display = "block"
                    //非开头节点
                  } else if (value.outgoing.length == 1 && value.incoming.length != 0) {

                  } else if (value.outgoing.length == 0) {

                    value.outgoing.push({id: "flow" + (clickCount + 11), sourceRef: prevNodeId, targetRef: nextNodeId})

                    document.getElementById("menu").children[0].style.display = "block"
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

    jsonData.forEach((value, index) => {
      if (value.id == currentId) {
        i = index
      }
    })
    jsonData.splice(i, 1)
    this.refresh()
    this.menuHide()
  }

  //删除下级节点
  deleteUnderlingNode(jsonData, currentId, prevNodeId, nextNodeId) {
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
    this.menuHide()
  }

  //添加分支
  addBranch(node, jsonData, clickCount, currentId, prevNodeId, nextNodeId) {

    let i = 0;
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
            "id": "flow" + (clickCount + 60),
            "targetRef": "editable" + clickCount,
            "sourceRef": prevNodeId
          }],
          "processInstanceId": "",
          "businessKey": "",
          "outgoing": [{
            "id": "flow" + (clickCount + 61),
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

            let incomingData = {
              id: "flow" + (clickCount + 74),
              sourceRef: "editable" + clickCount,
              targetRef: "editable0" + clickCount
            }

            //深拷贝对象
            nodeGroup = this.deepCopy(data)

            nodeGroup.incoming = value.incoming;

            nodeGroup.incoming.push(incomingData)

            nodeGroup.taskUserList[0]["taskName"] = "节点集合0" + clickCount
            nodeGroup.id = nodeGroup.taskUserList[0]["taskKey"] = "editable0" + clickCount;
            nodeGroup.elementType = 3

            nodeGroup.incoming.forEach((value) => {
              if (nextNodeId.indexOf("0") != -1) {
                value.targetRef = nextNodeId;
              } else {
                value.targetRef = "editable0" + clickCount
              }

            })

            nodeGroup.outgoing = [{
              id: "flow0" + (clickCount + 27),
              sourceRef: "editable0" + clickCount,
              targetRef: nextNodeId
            }]
            if (nextNodeId.indexOf("0") == -1) {

              value.incoming = [{
                id: "flow" + (clickCount + 70),
                sourceRef: "editable0" + clickCount,
                targetRef: nextNodeId
              }]

            }

          }
          //设置前节点的outgoing
          if (value.id == prevNodeId) {

            var outgoingData = {
              id: "flow" + (clickCount + 29),
              sourceRef: prevNodeId,
              targetRef: "editable" + clickCount
            }
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

    this.refresh()
    this.menuHide()
  }

  //刷新初始化
  refresh() {
    this.initBoard()
    this.initNodes()
    this.layoutNodes()
    this.drawCurves()
    this.watchNodeOffset()
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

  //隐藏右键菜单
  menuHide() {
    let menu = document.querySelector('#menu');
    menu.style.display = 'none'
  }

  unique(arr) {
    //去重
    for (var i = 0; i < arr.length; i++) {

      for (var j = i + 1; j < arr.length; j++) {
        if (arr[i].sourceRef == arr[j].sourceRef && arr[i].targetRef == arr[j].targetRef) {
          arr.splice(j, 1)

        }
      }

    }
  }

  unique1(arr) {
    //去重
    for (var i = 0; i < arr.length; i++) {

      for (var j = i + 1; j < arr.length; j++) {
        if (arr[i].id == arr[j].id) {

          arr.splice(j, 1)

        }
      }

    }
  }

  //删除父元素下的子元素
  remove(oparent, ochild, start, offset) {
    var parent = document.querySelector(oparent), // 获取父级元素

      children = parent.querySelectorAll(ochild), // 获取子级元素
      len = children.length,// 子元素的长度
      start = start || 0, // 开始的位置
      offset = offset ? start + offset : len; // 删除的数量，offset大于0，如果offset存在的话，那么开始位置加上位移，否则就是元素的长度剩余的长度；

    if (len <= start) return;
    for (var i = start; i < offset; i++) {
      parent.removeChild(children[i]);

    }

  }

}

module.exports = exports = Workflow

export default Workflow
