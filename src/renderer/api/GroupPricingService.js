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
  runQuoteCalculations(quoteId, basis) {
    return Api.post('/group-pricing/calculate-quote/' + quoteId + '/basis/' + basis)
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

  uploadQuoteTable(formdata) {
    return Api.post('group-pricing/quote-tables', formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },

  deleteQuoteTableData(quoteId, tableType) {
    return Api.delete('group-pricing/quote-tables/' + tableType + '/' + quoteId)
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
  getSchemesInforce() {
    return Api.get('/group-pricing/schemes/in-force')
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
  deleteQuote(quoteId) {
    return Api.delete('/group-pricing/quotes/' + quoteId)
  },
  getQuoteTable(quoteId, tableType) {
    return Api.get('/group-pricing/get-quote/' + quoteId + '/table-type/' + tableType)
  },
  getResultSummary(quoteId) {
    return Api.get('/group-pricing/get-quote/' + quoteId + '/result-summary')
  },
  createInsurer(formData) {
    return Api.post('/group-pricing/insurers', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },
  getInsurer() {
    return Api.get('/group-pricing/insurers')
  },
  acceptQuote(quoteId) {
    return Api.post('/group-pricing/quotes/' + quoteId + '/accept-quote')
  },
  approveQuote(quoteId) {
    return Api.post('/group-pricing/quotes/' + quoteId + '/approve-quote')
  },
  getDashboardData(year) {
    return Api.get('/group-pricing/dashboard/year/' + year)
  },
  getExposureData(year, benefit) {
    console.log('year and benefit', year, benefit)
    return Api.get('/group-pricing/dashboard/exposures/year/' + year + '/benefit/' + benefit)
  },
  checkDuplicateSchemeName(scheme) {
    return Api.get('/group-pricing/schemes/check-name/' + scheme)
  },
  getInforceDataTable(schemeId, tableType) {
    return Api.get('/group-pricing/inforce-data/' + schemeId + '/table-type/' + tableType)
  },
  addMember(member) {
    return Api.post('/group-pricing/schemes/' + member.scheme_id + '/members', member)
  }
}
