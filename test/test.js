import Workflower from '../src/main'
import axios from 'axios'

const ajax = axios.create()
const init = async function () {
  let result = await ajax.get('/mock/data.json')

  let workflower = new Workflower({
    nodes: result.data,
    element: document.querySelector('#app')
  })

  window.wf = workflower
}

init()
