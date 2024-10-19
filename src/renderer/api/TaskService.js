import Api from '@/renderer/api/Api'

export default {
  getTasks(user) {
    const json = JSON.stringify(user)
    return Api.post('tasks', json, {
      headers: { 'Content-Type': 'application/json' }
    })
  },
  createTask(task) {
    const json = JSON.stringify(task)
    return Api.post('create-task', json, {
      headers: { 'Content-Type': 'application/json' }
    })
  },
  deleteTask(taskId) {
    return Api.delete('delete-task/' + taskId)
  },
  checkApiRunning() {
    return Api.get('health')
  },
  getApiVersion() {
    return Api.get('version')
  }
}
