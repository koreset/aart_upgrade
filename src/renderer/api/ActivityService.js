import Api from '@/renderer/api/Api'

export default {
  createActivity(payload) {
    // payload.user_email = license.userEmail
    // payload.user_name = license.userName
    return Api.post('activity', payload)
  }
}
