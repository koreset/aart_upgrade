import { DateTime } from 'luxon'

function isFloat(value) {
  if (typeof value === 'number' && !Number.isNaN(value) && !Number.isInteger(value)) {
    return true
  }

  return false
}

function isInteger(value) {
  if (typeof value === 'number' && !Number.isNaN(value) && Number.isInteger(value)) {
    return true
  }
  return false
}

export const formatValues = (params) => {
  const header = params.column.userProvidedColDef.headerName

  // special cases for unix date. format as YYYY-MM-DD
  if (header === 'created') {
    // const date = new Date(params.value * 1000)
    const dt = DateTime.fromMillis(params.value * 1000)
    return dt.toLocaleString()
    // return new Date(params.value * 1000).toLocaleString()
  }

  // if (header === 'created') {
  //   return new Date(params.value * 1000).toLocaleString()
  // }

  if (isFloat(params.value)) {
    if (Math.abs(params.value) / 100 > 1) {
      return params.value.toLocaleString()
    } else {
      return params.value.toFixed(3)
    }
  }

  if (isInteger(params.value)) {
    if (
      header !== 'year' &&
      header !== 'id' &&
      header !== 'policy_number' &&
      header !== 'created'
    ) {
      return params.value.toLocaleString()
    } else {
      return params.value
    }
  }

  return params.value
}

export default formatValues
