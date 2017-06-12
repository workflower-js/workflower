import Workflower from '../src/main'
import axios from 'axios'

const ajax = axios.create()
const init = async function () {
  let result = await ajax.get('/mock/data.json')

  let workflower = new Workflower({
    nodes: result.data,
    element: document.querySelector('#app'),
    events: {
      click: function (event, type, node) {
        console.log(node)
      },
      onNodeClick: function (event, node) {
        console.log(node)
      }
    }
  })

  window.wf = workflower
}

init()
