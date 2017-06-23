import Workflower from '../src/main'
import axios from 'axios'

const ajax = axios.create()
const init = async function () {

  let result = await ajax.get('/mock/data.json')
  window.wf1 = new Workflower({
    nodes: result.data,
    element: document.querySelector('#wf1'),
    events: {
      click: function (event, type, node) {
        console.log(node)
      },
      onNodeClick: function (event, node) {
        console.log(node)
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
