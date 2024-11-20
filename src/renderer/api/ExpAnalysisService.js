import Api from '../api/Api'

export default {
  getConfigurations() {
    return Api.get('exp-analysis/get-configurations')
  },
  createConfiguration(configuration) {
    return Api.post('exp-analysis/create-configuration', configuration)
  },
  uploadExpData(data) {
    return Api.post('exp-analysis/upload-exp-exposure-data', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },
  uploadExpActualData(data) {
    return Api.post('exp-analysis/upload-exp-actual-data', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },
  uploadExpCurrentMortality(data) {
    return Api.post('exp-analysis/upload-exp-current-mortality-table', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },
  uploadExpCurrentLapse(data) {
    return Api.post('exp-analysis/upload-exp-current-lapse-table', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },

  getTableData(configurationId, tableName, year, version) {
    const payload = {
      configuration_id: configurationId,
      table_name: tableName,
      year,
      version
    }
    return Api.post('exp-analysis/get-table-data', payload)
  },
  deleteTableData(tableName) {
    return Api.delete('exp-analysis/tables/' + tableName)
  },
  getExposureAndActualYears(configurationId) {
    return Api.get(`exp-analysis/get-exposure-actual-years/${configurationId}`)
  },
  getAvailableExposureVersions(configurationId, year) {
    return Api.get(`exp-analysis/get-exposure-versions/${configurationId}/${year}`)
  },
  getAvailableLapseVersions(year) {
    return Api.get(`exp-analysis/get-lapse-versions/${year}`)
  },
  getAvailableMortalityVersions(year) {
    return Api.get(`exp-analysis/get-mortality-versions/${year}`)
  },
  getAvailableActualVersions(year) {
    return Api.get(`exp-analysis/get-actual-versions/${year}`)
  },
  checkRunName(runName) {
    return Api.post(`exp-analysis/check-run-name/${runName}`)
  },
  runAnalysis(runData) {
    return Api.post('exp-analysis/run-exp-analysis', runData)
  },
  getRunResults() {
    return Api.get('exp-analysis/get-exp-analysis-runs')
  },
  getExpModelPointsByRunId(runId) {
    return Api.get(`exp-analysis/get-exp-model-points/${runId}`)
  },
  getExpModelPointsByRunIdAndProduct(runId, product) {
    return Api.get(`exp-analysis/get-exp-model-points/${runId}/product/${product}`)
  },
  getExpCrudeResultsByRunId(runId) {
    return Api.get(`exp-analysis/get-exp-crude-results/${runId}`)
  },
  getExpLapseCrudeResultsByRunId(runId) {
    return Api.get(`exp-analysis/get-exp-lapse-crude-results/${runId}`)
  },
  getExpActualsVsExpectedByRunId(runId) {
    return Api.get(`exp-analysis/calculate-actuals-vs-expected/${runId}`)
  },
  getExpTableMetadata() {
    return Api.get(`exp-analysis/get-exp-table-metadata`)
  },
  uploadTables(formdata) {
    return Api.post('exp-analysis/tables', formdata, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Accept: 'multipart/form-data'
      }
    })
  },
  getDataForTable(tableName) {
    return Api.get('exp-analysis/tables/' + tableName)
  },
  deleteRun(runId) {
    return Api.delete(`exp-analysis/delete-exp-run/${runId}`)
  },
  deleteConfiguration(configurationId) {
    return Api.delete(`exp-analysis/delete-configuration/${configurationId}`)
  },
  deleteConfigData(tableDataName, portfolioId, year, version) {
    return Api.delete(
      'exp-analysis/config-data/' +
        tableDataName +
        '/portfolio/' +
        portfolioId +
        '/year/' +
        year +
        '/version/' +
        version
    )
  }
}
