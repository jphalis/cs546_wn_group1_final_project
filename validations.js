import { ObjectId } from 'mongodb'

const exportedMethods = {
  checkString (strVal, varName) {
    if (!strVal) {
      throw new Error(`Error: You must supply a ${varName}!`)
    }
    if (typeof strVal !== 'string') {
      throw new Error(`Error: ${varName} must be a string!`)
    }
    strVal = strVal.trim()
    if (strVal.length === 0) {
      throw new Error(
        `Error: ${varName} cannot be an empty string or string with just spaces`
      )
    }
    if (!isNaN(strVal)) {
      throw new Error(
        `Error: ${strVal} is not a valid value for ${varName} as it only contains digits`
      )
    }
    return strVal
  }
}

export default exportedMethods
