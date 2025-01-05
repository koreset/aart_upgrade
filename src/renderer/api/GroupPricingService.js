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
  },
  createBroker(broker) {
    return Api.post('/group-pricing/brokers', broker)
  },
  getBrokers() {
    return Api.get('/group-pricing/brokers')
  },
  getBroker(id) {
    return Api.get('/group-pricing/brokers/' + id)
  },
  deleteBroker(id) {
    return Api.delete('/group-pricing/brokers/' + id)
  },
  createScheme(scheme) {
    return Api.post('/group-pricing/schemes', scheme)
  },
  getSchemes() {
    return Api.get('/group-pricing/schemes')
  },
  getScheme(id) {
    return Api.get('/group-pricing/schemes/' + id)
  },
  deleteScheme(id) {
    return Api.delete('/group-pricing/schemes/' + id)
  }
}
