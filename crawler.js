const http = require('http')
const cheerio = require('cheerio')
const baseUrl = 'http://blog.huqing.site'

let catagories = [
  '/categories/%E5%89%8D%E7%AB%AF-Front-end/',
  '/categories/%E5%B7%A5%E5%85%B7-Tools/',
  '/categories/%E7%AE%97%E6%B3%95-Algorithm/'
]

function getCatagory(url) {
  return new Promise((resolve, reject) => {
    console.log('正在爬取：' + url)
    http
      .get(baseUrl + url, res => {
        let data
        res.on('data', html => {
          data += html
        })
        res.on('end', () => {
          resolve(parseHtml(data))
        })
      })
      .on('error', error => {
        console.log('获取数据出错！')
        reject(error)
      })
  })
}

function parseHtml(html) {
  const $ = cheerio.load(html)
  let articles = $('.post-header')
  let parsedData = []
  articles.each(function () {
    let section =  $(this)
    let title = section.find('.post-title-link span').text()
    let time = section.find('.post-meta time').attr('content')
    let item = {
      title,
      time
    }
    parsedData.push(item)
  })
  return parsedData
}

function printInfo(data) {
  console.info('\n' + '标题：' + data.title + '\n' + '日期：' + data.time)
}
let articlesData = []

catagories.forEach(url => {
  articlesData.push(getCatagory(url))
})

Promise.all(articlesData)
  .then(res => {
    res.forEach(item => {
      console.log('\n---------')
      item.forEach(info => {
        printInfo(info)
      })
    })
  })
  .catch(error => {
    console.log(error)
  })