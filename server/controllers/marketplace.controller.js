const BDO_API = require('../services/bdo_api.js')

// GET
exports.GetMarketplaceData = async (req, res) => {
  try {
    // transfer to helper function
    /* if (!req.body.docCount) {
      req.body.docCount = await Items.countDocuments({ validMarketplace: true })
    }

    if (req.body.currentPage === 1) {
      req.body.currentPage = 0
    }

    const items = await Items.find({ validMarketplace: true }, {}, { skip: req.body.currentPage * req.body.recordsPerPage, limit: req.body.recordsPerPage })

    if (!items || items.length === 0) return res.status(500).send({ message: 'No items found!' })

    const data = {
      items: items.map(item => {
        return {
          _id: item.id,
          Name: item.name,
          Price: item.basePrice,
          Stock: item.currentStock,
          Image: 'https://' + item.icon
        }
      }),
      totalItems: req.body.docCount
    } */
    const searchData = {
      docCount: req.body.docCount,
      currentPage: req.body.currentPage
    }

    if (req.method == "GET") {
      req.body.searchData = { mainCategory: "Registration Queue" }
    }

    const responseData = await BDO_API.GetMarketplaceCategoryData(searchData, req.body.searchData.mainCategory, req.body.searchData.subCategory)
    const data = {
      items: responseData.fixItems,
      totalItems: responseData.totalItems
    }
    console.log('Controller finished!', responseData.data)
    res.status(200).send(responseData.data)
  } catch (err) {
    console.error(err)
    res.status(500).send({ message: err.message })
  }
}