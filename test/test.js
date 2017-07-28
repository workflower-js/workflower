import Workflower from '../src/main'
import axios from 'axios'



const ajax = axios.create()
const init = async function () {

  let result = await ajax.get('/mock/data.json')
	let clickCount=0	
	let nodeCount=1

  window.wf1 = new Workflower({
    nodes: result.data,
    element: document.querySelector('#wf1'),
    events: {
      click: function (event, type, node) {
        console.log(node)
        
      },
      onNodeClick: function (event, node) {
        console.log(node)
      },
      rightClick:function(event, node){
					this.menu(event,"menu")
					
					//添加下级节点
					document.getElementById("addNode").onclick = ()=>{
						clickCount++
						
	    			this.addNode(node,this.options.nodes,clickCount)
					}
					//添加同级分支
					document.getElementById("addBranch").onclick = ()=> {
						clickCount++
						this.addBranch(node,this.options.nodes,clickCount)
					}
					//删除元素
					document.getElementById("deleteNode").onclick= ()=> {
						this.deleteNode(node,this.options.nodes,clickCount)
					}
					//修改属性
					document.getElementById("modifyAttr").onclick= ()=> {
						
						this.modifyAttr(node,this.options.nodes)

					}
					//保存
					document.getElementById("save").onclick= ()=>{
						console.log(this.options.nodes)
						let dataTemplate={
						  "endEvent": {},
						  "exclusiveGatewayList": [],
						  "flowList": [],
						  "parGateWayList": [],
						  "processId": "",
						  "processName": "",
						  "startEvent": {},
						  "usertaskList": []
						}
						this.options.nodes.forEach((value,index)=> {
							value.incoming.forEach((value,index)=>{
								
									dataTemplate.flowList.push(value)							
							})
							value.outgoing.forEach((value,index)=>{
								
									dataTemplate.flowList.push(value)	
						
							})	
							
							unique(dataTemplate.flowList)
							console.log(dataTemplate.flowList)			
							if(value.elementType==0) {
								dataTemplate.startEvent.id=value.id
							}else if (value.elementType==2){
								dataTemplate.endEvent.id=value.id
							}else if (value.elementType==3){
								dataTemplate.exclusiveGatewayList.push({"id":value.id,"name":value.taskName})
							}else {
								
								value.taskUserList.forEach((value1,index)=> {
									console.log(value1.assignee)
									console.log(value1.taskName)
									
									dataTemplate.usertaskList.push({
										"assignee": [value1.assignee],
										"charInfo": {"condition":"","userTaskId":value1.taskId},
										"id": value1.taskKey,
										"name": value1.taskName
									})
									
								})
								unique(dataTemplate.usertaskList)
								console.log(dataTemplate.usertaskList)
								
							}
							dataTemplate.processId=node.$element.parentElement.parentElement.parentElement.id
							dataTemplate.processName=node.$element.parentElement.parentElement.parentElement.id
							
						})
//						console.log(dataTemplate)
//						axios.post('http://192.168.1.150:2224/bpmn/produceBpmnJson',dataTemplate).then(function(res){console.log(res)}).catch(function(err){console.log(err)})
						var str = JSON.stringify(dataTemplate)
						localStorage.setItem(str,"data")
						
					}
      }
      
    }
  })

  let result2 = await ajax.get('/mock/data2.json')
  window.wf2 = new Workflower({
    nodes: result2.data,
    element: document.querySelector('#wf2'),
    events: {
      click: function (event, type, node) {
        console.log(node)
      },
      onNodeClick: function (event, node) {
        console.log(node)
      }
    }
  })
}

init()
function unique(arr){
	//去重
	for(var i=0;i<arr.length;i++){
		
			for(var j=i+1;j<arr.length;j++){
				if(arr[i].id==arr[j].id){
				arr.splice(j,1)
			}									
	}

	}
}



