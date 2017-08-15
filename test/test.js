import Workflower from '../src/main'
import axios from 'axios'



const ajax = axios.create()
const init = async function () {

  let result = await ajax.get('/mock/data3.json')

	console.log(result.data)
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
      	console.log("右键")
      },
      
      modifyAttr: function() {
      	
      	
      	$( "#nodeNames" ).dialog({
		    		autoOpen: false,
		    		title : "修改用户名",
			      resizable: false,
			      height:500,
			      width:640,
			      modal: true,
			      open: function (event, ui) {
                 $(".ui-dialog-titlebar-close", $(this).parent()).hide();
            },
			      buttons: {
			        "保存": function() {
			        	$("#confirm1").click()
			          $( this ).dialog( "close" );
			          
			        },
			        "取消": function() {
			          $( this ).dialog( "close" );
			        }
			      }
		   });

				
//		   	$( "#nodeNameContainer" ).append($( "#nodeName" ))
		   
		   
			 $( "#nodeNames" ).dialog( "open" );		
     }
      	
    }
  })
  
//let result2 = await ajax.get('/mock/data2.json')
//window.wf2 = new Workflower({
//  nodes: result2.data,
//  element: document.querySelector('#wf2'),
//  events: {
//    click: function (event, type, node) {
//      console.log(node)
//    },
//    onNodeClick: function (event, node) {
//      console.log(node)
//    }
//  }
//})
}

init()




