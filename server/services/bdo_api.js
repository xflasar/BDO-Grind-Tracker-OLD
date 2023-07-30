const Items = require('../db/models/item.model.js')
const { GetFetch } = require('../api/handleFetch.js')

// Used to populate database with BDO Market items
exports.GetDatabaseDump = async () => {
  console.time('DatabaseDump')
  console.log('DatabaseItemDump started.')
  try {
    const fetchedItems = await GetFetch('https://api.arsha.io/util/db/dump?lang=en')
    if (fetchedItems) {
      let curItemCounter = 0
      const totalItemCounter = fetchedItems.length
      const itemIds = fetchedItems.map(item => item.id)
      const existingItems = await Items.find({ id: { $in: itemIds } })
      const existingItemsIds = existingItems.map(item => item.id)
      const addNewDataList = []
      const updateDataList = []

      for (const item of fetchedItems) {
        curItemCounter++
        if (!existingItemsIds.includes(item.id)) {
          const newItem = new Items({
            id: item.id,
            name: item.name,
            grade: item.grade,
            icon: item.icon
          })
          addNewDataList.push(newItem)
        } else {
          updateDataList.push(item)
        }
        console.clear()
        console.log(`Progress: ${curItemCounter} out of ${totalItemCounter} items. AddItems: ${addNewDataList.length} UpdateItems: ${updateDataList.length}`)
      }
      if (addNewDataList.length > 0) {
        await Items.insertMany(addNewDataList).then(console.log(`Added ${addNewDataList.length} items.`))
      }

      // Handle deleted items
      const deletedItems = existingItems.filter(item => !itemIds.includes(item.id))
      if (deletedItems.length > 0) {
        const deletedItemIds = deletedItems.map(item => item.id)
        Items.deleteMany({ id: { $in: deletedItemIds } })
      }

      console.log('DatabaseItemDump ended.')
      console.timeEnd('DatabaseDump')
    }
  } catch (error) {
    console.error('Error while updating database:', error)
  }
}

// Used to update market item prices
exports.UpdateMarketItemPrices = async () => {
  console.time('DatabaseUpdateMarketItemPrices')
  console.log('Database Market Item Prices Update started.')
  const fetchedData = []
  await Items.find().then(async (items) => {
    const batchSize = 100

    let itemIds = items.map(item => {
      if (item.validMarketplace === true) {
        return item.id
      } else if (item.validMarketplace === false) {
        return null
      }
      return item.id
    })
    itemIds = itemIds.filter(Number)
    for (let startIdx = 0; startIdx < itemIds.length; startIdx += batchSize) {
      const endIdx = startIdx + batchSize
      const batchItemIds = itemIds.slice(startIdx, endIdx)
      const urlParam = '?ids=' + batchItemIds.join(',')

      const responseData = await GetFetch('https://api.arsha.io/v2/eu/GetWorldMarketSearchList' + urlParam)
      responseData.forEach((data) => {
        const newItemData = data
        const curItemData = items.filter(item => item.id === data.id)

        if (curItemData[0].basePrice !== newItemData.basePrice || curItemData[0].currentStock !== newItemData.currentStock || curItemData[0].totalTrades !== newItemData.totalTrades) {
          fetchedData.push(data)
        }
      })
    }
  })

  const bulkUpdateOperations = []
  fetchedData.forEach((item) => {
    if (item) {
      if (item.basePrice === null) {
        bulkUpdateOperations.push({
          updateOne: {
            filter: { id: item.id },
            update: {
              validMarketplace: false
            }
          }
        })
      } else {
        bulkUpdateOperations.push({
          updateOne: {
            filter: { id: item.id },
            update: {
              currentStock: item.currentStock,
              totalTrades: item.totalTrades,
              basePrice: item.basePrice,
              validMarketplace: true
            }
          }
        })
      }
    }
  })

  const validBulkUpdateOperations = bulkUpdateOperations.filter(op => op)

  try {
    await Items.bulkWrite(validBulkUpdateOperations).then((result) => console.log('Finished editing data to db => ' + result.modifiedCount))
  } catch (error) {
    console.log(error)
  }
}
