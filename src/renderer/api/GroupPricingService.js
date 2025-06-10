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
  runQuoteCalculationsWithCredibility(quoteId, basis, credibility) {
    return Api.post(
      '/group-pricing/calculate-quote/' +
        quoteId +
        '/basis/' +
        basis +
        '/credibility/' +
        credibility
    )
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

  deleteTable(tableType, year, riskCode) {
    return Api.delete(
      'group-pricing/rate-tables/' + tableType + '/year/' + year + '/risk-code/' + riskCode
    )
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
  getIndustries() {
    return Api.get('/group-pricing/industries')
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
  changeQuoteStatus(quote) {
    return Api.post('/group-pricing/quotes/' + quote.id + '/update-status', quote)
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
  },
  getMembersInForce(schemeId) {
    return Api.get('/group-pricing/schemes/' + schemeId + '/members')
  },
  submitClaim(claim) {
    const payload = JSON.stringify(claim)
    return Api.post('/group-pricing/claims', payload)
  },
  getClaims() {
    return Api.get('/group-pricing/claims')
  },
  getMemberRating(schemeId, quoteId, memberId) {
    return Api.get(
      '/group-pricing/claims/scheme/' +
        schemeId +
        '/quote/' +
        quoteId +
        '/member/' +
        memberId +
        '/rating'
    )
  },
  getTableYears(tableType) {
    return Api.get('/group-pricing/rate-tables/' + tableType + '/get-years')
  },
  getRiskRateCodes(tableType, year) {
    return Api.get('/group-pricing/rate-tables/' + tableType + '/get-risk-codes/' + year)
  },
  getBenefitMaps() {
    return Api.get('/group-pricing/benefit-maps')
  },
  saveBenefitMap(benefitMaps) {
    return Api.post('/group-pricing/benefit-maps', benefitMaps)
  },
  getBenefitDefinitions() {
    return Api.get('/group-pricing/benefit-definitions')
  },
  getUserRoles() {
    return Api.get('/group-pricing/user-management/roles')
  },
  getPermissions() {
    return Api.get('/group-pricing/user-management/permissions')
  },
  createUserRole(role) {
    return Api.post('/group-pricing/user-management/roles', role)
  },
  getRolePermissions(roleId) {
    return Api.get('/group-pricing/user-management/roles/' + roleId + '/permissions')
  },
  updateUserRole(userRole) {
    return Api.put('/group-pricing/user-management/users/assign_role', userRole)
  },
  getRoleForUser(licenseId) {
    return Api.get('/group-pricing/user-management/users/license/' + licenseId + '/role')
  },
  deleteUserRole(roleId) {
    return Api.delete('/group-pricing/user-management/roles/' + roleId)
  },
  removeUserRole(userRole) {
    return Api.post('/group-pricing/user-management/users/remove_role', userRole)
  },
  getIncomeEscalations() {
    return Api.get('/group-pricing/quotes/income-escalations')
  },
  getTtdDisabilityDefinitions() {
    return Api.get('/group-pricing/quotes/ttd-disability-definitions')
  },
  getPtdDisabilityDefinitions() {
    return Api.get('/group-pricing/quotes/ptd-disability-definitions')
  }
}
