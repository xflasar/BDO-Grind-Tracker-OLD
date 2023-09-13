exports.TaxCalculation = (data) => {
  let taxCalculated = -0.35

  if (data.valuePack) taxCalculated = (taxCalculated + 0.195)

  if (data.merchantRing) taxCalculated = (taxCalculated + 0.0325)

  if (data.familyFame >= 1000 && data.familyFame < 4000) {
    taxCalculated = (taxCalculated + 0.0033)
  } else if (data.familyFame >= 4000 && data.familyFame < 7000) {
    taxCalculated = (taxCalculated + 0.0065)
  } else if (data.familyFame >= 7000) {
    taxCalculated = (taxCalculated + 0.0098)
  }

  return parseFloat(taxCalculated.toFixed(4))
}

exports.UserSettingsModify = async (data, initialData) => {
  for (const key in initialData._doc) {
    if (data[key] !== undefined && data[key] !== null && data[key] !== initialData[key]) {
      initialData[key] = data[key]
    }
  }
  await initialData.save({ new: true })
  return initialData
}
