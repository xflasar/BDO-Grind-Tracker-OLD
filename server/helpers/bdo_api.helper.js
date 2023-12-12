const FetchItemCategories = async (mainCategory, subCategory = 1) => {
  const urlParam = '?mainCategory=' + mainCategory + '&subCategory=' + subCategory
  try {
    const response = await fetch('https://api.arsha.io/v1/eu/GetWorldMarketList' + urlParam)
    // Format Data
    if (!response.ok) return null
    const data = await response.json()

    const tempData = data.resultMsg.split('|')
    const fetchedItems = []

    const category = GetCategoryByIds(mainCategory, subCategory)

    tempData.forEach(item => {
      if (item === '') return

      const itemData = item.split('-')
      const itemObj = {
        id: itemData[0],
        mainCategory: category.mainCategory,
        subCategory: category.subCategory,
        currentStock: itemData[1],
        totalTrades: itemData[2],
        basePrice: itemData[3]
      }
      fetchedItems.push(itemObj)
    })

    return fetchedItems
  } catch (error) {
    console.log(error)
  }
}

exports.DatabaseItemCategoryUpdate = async (dbSchema) => {
  // Get all items in categories
  console.log('Fetching items from categories.')
  const mainCategoryKeys = Object.keys(categories)
  const data = []

  for (const mainCategory of mainCategoryKeys) {
    for (let i = 1; i <= Object.keys(categories[mainCategory].content).length; i++) {
      const subCategory = i
      const dataRes = await FetchItemCategories(mainCategory, subCategory)
      data.push(dataRes)
    }
  }

  // Update items in database
  console.log('Updating items in database.')
  await UpdateDatabaseByItemIds(dbSchema, data)

  console.log('Database Item Category Update Finished Successfully!')
}

// Whole categories obj
const categories = {
  1: {
    name: 'Main Weapon',
    content: {
      1: 'Longsword',
      2: 'Longbow',
      3: 'Amulet',
      4: 'Axe',
      5: 'Shortsword',
      6: 'Blade',
      7: 'Staff',
      8: 'Kriegsmesser',
      9: 'Gauntlet',
      10: 'Crescent Pendulum',
      11: 'Crossbow',
      12: 'Florang',
      13: 'Battle Axe',
      14: 'Shamshir',
      15: 'Morning Star',
      16: 'Kyve',
      17: 'Serenaca',
      18: 'Slayer',
      19: 'Swallowtail Fan'
    }
  },
  5: {
    name: 'Sub Weapon',
    content: {
      1: 'Shield',
      2: 'Dagger',
      3: 'Talisman',
      4: 'Ornamental Knot',
      5: 'Trinket',
      6: 'Horn Bow',
      7: 'Kunai',
      8: 'Shuriken',
      9: 'Vambrace',
      10: 'Noble Sword',
      11: 'Ra\'ghon',
      12: 'Vitclari',
      13: 'Haladie',
      14: 'Quoratum',
      15: 'Mareca',
      16: 'Shard',
      17: 'Do Stave',
      18: 'Binyeo Knife'
    }
  },
  10: {
    name: 'Awakening Weapon',
    content: {
      1: 'Great Sword',
      2: 'Scythe',
      3: 'Iron Buster',
      4: 'Kamasylven Sword',
      5: 'Celestial Bo Staff',
      6: 'Lancia',
      7: 'Crescent Blade',
      8: 'Kerispear',
      9: 'Sura Katana',
      10: 'Sah Chakram',
      11: 'Aad Sphera',
      12: 'Godr Sphera',
      13: 'Vediant',
      14: 'Gardbrace',
      15: 'Cestus',
      16: 'Crimson Glaives',
      17: 'Greatbow',
      19: 'Jordun',
      20: 'Dual Glaives',
      21: 'Sting',
      22: 'Kibelius',
      23: 'Patraca',
      24: 'Trion',
      25: 'Soul Tome',
      26: 'Foxtail Fans'
    }
  },
  15: {
    name: 'Armor',
    content: {
      1: 'Helmet',
      2: 'Armor',
      3: 'Gloves',
      4: 'Shoes',
      5: 'Functional Clothes',
      6: 'Crafted Clothes'
    }
  },
  20: {
    name: 'Accessory',
    content: {
      1: 'Ring',
      2: 'Necklace',
      3: 'Earring',
      4: 'Belt'
    }
  },
  25: {
    name: 'Material',
    content: {
      1: 'Ore/Gem',
      2: 'Plants',
      3: 'Seed/Fruit',
      4: 'Leather',
      5: 'Blood',
      6: 'Meat',
      7: 'Seafood',
      8: 'Misc.'
    }
  },
  30: {
    name: 'Enhancement/Upgrade',
    content: {
      1: 'Black Stone',
      2: 'Upgrade'
    }
  },
  35: {
    name: 'Consumables',
    content: {
      1: 'Offensive Elixir',
      2: 'Defensive Elixir',
      3: 'Functional Elixir',
      4: 'Food',
      5: 'Potion',
      6: 'Siege Items',
      7: 'Item Parts',
      8: 'Other Consumables'
    }
  },
  40: {
    name: 'Life Tools',
    content: {
      1: 'Lumbering Axe',
      2: 'Fluid Collector',
      3: 'Butcher Knife',
      4: 'Pickaxe',
      5: 'Hoe',
      6: 'Tanning Knife',
      7: 'Fishing Tools',
      8: 'Matchlock',
      9: 'Alchemy/Cooking',
      10: 'Other Tools'
    }
  },
  45: {
    name: 'Alchemy Stone',
    content: {
      1: 'Destruction',
      2: 'Protection',
      3: 'Life',
      4: 'Spirit Stone'
    }
  },
  50: {
    name: 'Magic Crystal',
    content: {
      1: 'Main Weapon',
      2: 'Sub-weapon',
      8: 'Awakening Weapon',
      3: 'Helmet',
      4: 'Armor',
      5: 'Gloves',
      6: 'Shoes',
      7: 'Versatile'
    }
  },
  55: {
    name: 'Pearl Items',
    content: {
      1: 'Male Apparel (Set)',
      2: 'Female Apparels (Set)',
      3: 'Male Apparel (Individual)',
      4: 'Female Apparel (Individual)',
      5: 'Class-based Apparel (Set)',
      6: 'Functional',
      7: 'Mount',
      8: 'Pet'
    }
  },
  60: {
    name: 'Dye',
    content: {
      1: 'Basic',
      2: 'Olvia',
      3: 'Velia',
      4: 'Heidelian',
      5: 'Keplan',
      6: 'Calpheon',
      7: 'Mediah',
      8: 'Valencia'
    }
  },
  65: {
    name: 'Mount',
    content: {
      1: 'Registration',
      2: 'Feed',
      3: 'Champron',
      4: 'Barding',
      5: 'Saddle',
      6: 'Stirrups',
      7: 'Horseshoe',
      9: '[Elephant] Stirrups',
      10: '[Elephant] Armor',
      11: '[Elephant] Mask',
      12: '[Elephant] Saddle',
      13: 'Courser Training'
    }
  },
  70: {
    name: 'Ship',
    content: {
      1: 'Registration',
      2: 'Cargo',
      3: 'Prow',
      4: 'Decoration',
      5: 'Totem',
      6: 'Prow Statue',
      7: 'Plating',
      8: 'Cannon',
      9: 'Sail'
    }
  },
  75: {
    name: 'Wagon',
    content: {
      1: 'Registration',
      2: 'Wheel',
      3: 'Cover',
      4: 'Flag',
      5: 'Emblem',
      6: 'Lamp'
    }
  },
  80: {
    name: 'Furniture',
    content: {
      1: 'Bed',
      2: 'Bedside Table/Table',
      3: 'Wardrobe/Bookshelf',
      4: 'Sofa/Chair',
      5: 'Chandelier',
      6: 'Floor/Carpet',
      7: 'Wall/Curtain',
      8: 'Decoration',
      9: 'Others'
    }
  }
}

// Helper for FetchItemCategories Formating
// mainCategoryId, subCategoryId can be number or string depending on reverse
function GetCategoryByIds (mainCategoryId, subCategoryId, reverse = false) {
  const categoryData = {
    mainCategory: null,
    subCategory: null
  }

  if (!reverse) {
    categoryData.mainCategory = categories[mainCategoryId].name
    categoryData.subCategory = categories[mainCategoryId].content[subCategoryId]
  } else {
    // I don't think this is efficient but suffice for now
    categories.forEach(category => {
      if (category.name === mainCategoryId) {
        categoryData.mainCategory = category.name
        category.content.forEach(subCategory => {
          if (subCategory === subCategoryId) categoryData.subCategory = subCategory
        })
      }
    })
  }

  return categoryData
}

async function fetchItemIcon (item) {
  return '../assets/no-image.png'
  const resImg = await fetch(`https://${item.icon}`)
  return resImg.ok ? `https://${item.icon}` : '../assets/no-image.png'
}

async function formatItem (item) {
  const iconUrl = await fetchItemIcon(item)
  const itemName = item.name.includes('&#39;') ? item.name.replace('&#39;', "'") : item.name

  return {
    _id: item._id,
    Name: itemName,
    Image: iconUrl,
    Price: item.basePrice,
    Stock: item.currentStock
  }
}

exports.GetCategoryDataFromDB = async (dbSchema, searchData, mainCategory = 'All', subCategory = 'All') => {
  try {
    if (searchData.currentPage === 1) {
      searchData.currentPage = 0
    }

    const query = { validMarketplace: true }
    if (mainCategory !== 'All' && subCategory !== 'All') {
      query.mainCategory = mainCategory
      query.subCategory = subCategory
    }

    if (!searchData.docCount) {
      searchData.docCount = await dbSchema.countDocuments(query)
    }

    const items = await dbSchema
      .find(query, {}, { skip: searchData.currentPage * searchData.recordsPerPage, limit: searchData.recordsPerPage })

    const fixItems = await Promise.all(items.map(formatItem))

    const data = {
      fixItems,
      totalItems: searchData.docCount
    }

    return data
  } catch (error) {
    console.log(error)
  }
}

// Create a function that gets the registration queue
exports.GetRegistrationQueue = async (dbSchema) => {
  try {
    const options = {
      family: 4
    }
    const response = await fetch('https://api.arsha.io/v1/eu/GetWorldMarketWaitList', options)

    if (!response.ok) {
      console.log(response.status)
      return { fixItems: [], totalItems: 0 }
    }

    const resData = await response.json()
    const tempResData = resData.resultMsg.split('|')

    const resDataTemp = tempResData
      .filter(item => item !== '')
      .map(item => {
        const [id, , basePrice, timespan] = item.split('-')
        return {
          id,
          basePrice,
          timespan
        }
      })

    const itemIds = resDataTemp.map(item => item.id)

    const items = await dbSchema.find({ id: { $in: itemIds } }, '_id id name icon currentStock')

    const missingItems = []
    const unformattedItems = resDataTemp.map(item => {
      const itemFromDB = items.find(itemInner => itemInner.id === Number(item.id))
      if (!itemFromDB) {
        missingItems.push(item.id)
        return null
      }
      return {
        id: itemFromDB._id,
        name: itemFromDB.name,
        icon: itemFromDB.icon,
        basePrice: item.basePrice,
        identifier: item.id
      }
    }).filter(item => item !== null)

    // If there are missing items, log them into file ( I GUESS )
    if (missingItems.length > 0) {
      console.log(`Missing items: ${missingItems}`)
    }

    // Use 'Promise.all' to parallelize fetching item images
    const fixItems = await Promise.all(unformattedItems.map(async (item) => {
      // This needs to be rewriten most likely internal database for the icons/storage/external website server
      /* const resImg = await fetch(`https://${item.icon}`)
      if (resImg.ok) {
        item.icon = `https://${item.icon}`
      } else {
        item.icon = '../assets/no-image.png'
      } */

      if (item.name.includes('&#39;')) {
        item.name = item.name.toString().replace('&#39;', "'")
      }

      return {
        _id: item.id,
        Name: item.name,
        Image: item.icon,
        Price: item.basePrice,
        identifier: GenerateUniqueId()
      }
    }))

    const itemsData = {
      fixItems,
      totalItems: unformattedItems.length
    }
    return itemsData
  } catch (error) {
    console.log(error)
    return { fixItems: [], totalItems: 0 }
  }
}

function GenerateUniqueId () {
  const timestamp = new Date().getTime()
  const random = Math.floor(Math.random() * 1000000)

  const uniqueId = `${timestamp}${random}`

  return uniqueId
}

const UpdateDatabaseByItemIds = async (dbSchema, items) => {
  try {
    let bulkUpdateOps = []
    let counter = 0

    items.forEach(item => {
      if (item.length === 0) return

      item.forEach(subItem => {
        bulkUpdateOps.push({
          updateOne: {
            filter: { id: subItem.id },
            update: { $set: { mainCategory: subItem.mainCategory, subCategory: subItem.subCategory, currentStock: subItem.currentStock, totalTrades: subItem.totalTrades, basePrice: subItem.basePrice } },
            upsert: true
          }
        })
        counter++

        if (counter % 500 === 0) {
          dbSchema.bulkWrite(bulkUpdateOps, { ordered: true, w: 1 })
          bulkUpdateOps = []
        }
      })
    })

    if (counter % 500 !== 0) {
      dbSchema.bulkWrite(bulkUpdateOps, { ordered: true, w: 1 })
    }
    console.log('Database updated')
  } catch (error) {
    console.log(error)
  }
}
