import Api from '@/renderer/api/Api'

export default {
  generateQuote(formData) {
    return Api.post('/group-pricing/generate-quote', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  }
}
