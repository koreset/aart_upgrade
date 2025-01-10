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
  },
  getParameterBases() {
    return Api.get('/group-pricing/parameter-bases')
  },
  getQuotes(filter) {
    return Api.get('/group-pricing/get-quotes/filter/' + filter)
  },
  getAllQuotes() {
    return Api.get('/group-pricing/get-quotes')
  },
  changeQuoteStatus(quoteId, status) {
    return Api.put('/group-pricing/quotes/' + quoteId + '/update-status/' + status)
  },
  getQuote(quoteId) {
    return Api.get('/group-pricing/get-quote/' + quoteId)
  },
  getQuoteTable(quoteId, tableType) {
    return Api.get('/group-pricing/get-quote/' + quoteId + '/table-type/' + tableType)
  }
}
