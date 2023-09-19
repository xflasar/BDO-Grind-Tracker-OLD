const cheerio = require('cheerio')
exports.Scrapped = async () => {
  const res = await fetch('https://www.naeu.playblackdesert.com/en-US/News/Notice', {
    method: 'GET'
  })
  if (res.ok) {
    const body = await res.text()
    const $ = cheerio.load(body)
    const news = []
    $('.thumb_nail_list').find('li').each((i, el) => {
      if (el.name === 'li') {
        const newsItem = {
          title: $(el).find($('.desc')).text() !== '' ? $(el).find($('.desc')).text() : $(el).find($('.line_clamp')).text(),
          newsUrl: $(el).find('a').attr('href'),
          newsIcon: $(el).find('img').attr('src'),
          date: $(el).find($('.date')).text()
        }
        news.push(newsItem)
      }
    })
    return news
  }
}
