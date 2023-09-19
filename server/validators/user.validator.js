exports.AddSessionValidator = (dataToValidate) => {
  const validationErrors = []
  let validated = false
  const validationRules = {
    SiteName: {
      type: 'string',
      required: true
    },
    TimeSpent: {
      type: 'number',
      required: true
    },
    TotalEarned: {
      type: 'number',
      required: true
    },
    TotalExpenses: {
      type: 'number',
      required: true
    },
    AP: {
      type: 'number',
      required: true
    },
    DP: {
      type: 'number',
      required: true
    }
  }

  Object.keys(validationRules).forEach((key) => {
    if (validationRules[key].required && (dataToValidate[key] === undefined || dataToValidate[key] === null)) {
      validationErrors.push(`${key} is required`)
    }

    if ((typeof dataToValidate[key]).toString() !== validationRules[key].type) {
      validationErrors.push(`${key} must be ${validationRules[key].type}`)
    }
  })

  validated = validationErrors.length === 0

  return { result: validated, errors: validationErrors }
}
