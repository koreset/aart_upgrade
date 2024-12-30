import Api from '@/renderer/api/Api'

export default {
  generateQuote(formData) {
    return Api.post('/group-pricing/generate-quote', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },
  getTableMetaData() {
    return Api.get('/group-pricing/rate-tables')
  },
  uploadTables(formdata) {
    return Api.post('group-pricing/rate-tables', formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },
  deleteTable(tableType) {
    return Api.delete('group-pricing/rate-tables/' + tableType)
  },
  getDataForTable(tableType) {
    return Api.get('/group-pricing/rate-tables/' + tableType.toLowerCase())
  }
}
