import axios from 'axios'
import _ from 'lodash'
import { scrapeHTML } from 'scrape-it'

const proxyUrl = 'https://cors-anywhere.herokuapp.com/'

export async function COOLPC_evaluate () {
  const { data: body } = await axios.get<string>(`${proxyUrl}http://www.coolpc.com.tw/evaluate.php?mobile=false`)

  const data: IEvaluatePageModel = await scrapeHTML<IEvaluatePageModel>(body, {
    updatedAt: {
      selector: 'tr#thy > th:nth-child(3) > font:nth-child(1)',
      convert: (val: string) => {
        const time = /\d*\/\d*\/\d*\ \d*\:\d*/.exec(val)
        if (!time || time.length <= 0) return undefined

        return new Date(time[0])
      }
    },
    indexs: {
      selector: 'head > script',
      how: 'html',
      convert: (scriptText: string) => {
        return JSON.parse(scriptText
          .replace(/\=\[/gm, '":[')
          .replace(/\]$/gm, '],"')
          .replace(/^/, '{"')
          .replace(/$/, '}')
          .replace(/\n/g, '')
          .replace(/\,\"\n?\J\=(.|\n)*\}$/, '}'),
        )
      },
    }, // Endof indexs
    categories: {
      listItem: '#tbdy > tr',
      data: {
        index: {
          selector: 'td.w',
          convert: (val) => _.parseInt(val),
        },
        name: {
          selector: 'td.w',
          convert: (...args) => {
            const $elm: Cheerio = args[1]
            return $elm.next().text()
          }
        },
        summary: {
          selector: 'td:nth-child(3) > select > option[value=0]',
          convert: (val: string) => {
            const rules = [
              { key: 'all', keywords: '共有商品' },
              { key: 'hot', keywords: '熱賣' },
              { key: 'image', keywords: '圖片' },
              { key: 'discuss', keywords: '討論' },
              { key: 'change', keywords: '價格異動' },
              { key: 'limited', keywords: '限時下殺▼' },
            ]

            return rules.reduce((result, rule) => {
              const regexKeyword = new RegExp(`${rule.keywords}\\ ?\\d+`)
              const regexNumber = new RegExp(`\\d+`)
              const execedKeyword = regexKeyword.exec(val)
              if (!execedKeyword || execedKeyword.length <= 0) return result

              const execedNumber = regexNumber.exec(execedKeyword[0])
              if (!execedNumber || execedNumber.length <= 0) return result

              val.replace(execedKeyword[0], '')
              result[rule.key] = parseInt(execedNumber[0], 0)

              return result
            }, {
              all: undefined,
              hot: undefined,
              image: undefined,
              discuss: undefined,
              change: undefined,
              limited: undefined,
            })
          },
        },
        groups: {
          listItem: 'td:nth-child(3) > select > optgroup',
          data: {
            name: { attr: 'label' },
            products: {
              listItem: 'option:enabled',
              data: {
                index: { attr: 'value', convert: (val) => _.parseInt(val), },
                name: { how: 'text', convert: (name: string) => name.replace('熱賣', '')
                  .replace('◆', '')
                  .replace('★', '')
                  .replace('*可刷卡', '')
                  .replace('*最後優惠', '')
                  .replace(/\↘\$/g, '')
                  .replace(/\↗\$/g, '')
                  .replace(/\$\d*/g, '')
                  .replace(',', '')
                  .trim()},
                state: { how: 'text', convert: (name: string) => {
                  const matched = (rule) => name.lastIndexOf(rule) > 0

                  return {
                    hot: matched('熱賣'),
                    unbox: matched('◆'),
                    image: matched('★'),
                    creditCard: matched('*可刷卡'),
                    lastSpecial: matched('*最後優惠'),
                  }
                }},
                price: { how: 'text', convert: (name: string) => {
                  const prices = name.match(/\$\d+/g)
                  if (!prices || prices.length <= 0) return undefined

                  const matched = (rule) => {
                    const result = rule.exec(name)
                    return result && result.length > 0
                  }
                  const hasSpecialPrice = matched(/\↘\$/g) || matched(/\↗\$/g)
                  return {
                    source: hasSpecialPrice
                      ? _.chain(prices[0])
                        .replace(/\$/, '')
                        .parseInt()
                        .value()
                      : _.chain(prices[0])
                        .replace(/\$/, '')
                        .parseInt()
                        .value(),
                    special: hasSpecialPrice
                      ? _.chain(prices[1])
                        .replace(/\$/, '')
                        .parseInt()
                        .value()
                      : undefined,
                  }
                }},
              },
            }, // Endof products
          },
        }, // Endof groups
      },
    }, // Endof categories
  })

  return data
}

export async function COOLPC_productInfo (d: number, g: number) {
  const fromData = new FormData()
  fromData.append('D', d + '')
  fromData.append('G', g + '')

  const response = await axios.post<string>(
    `${proxyUrl}http://www.coolpc.com.tw/eva-img.php`,
    fromData
  )

  const data: IProductInfoPageModel = await scrapeHTML<IProductInfoPageModel>(response.data, {
    image: {
      selector: 'img',
      attr: 'src',
      convert: (val) => val ? `http://coolpc.com.tw/${val}/` : null,
    },
    detail: {
      listItem: 'table table td',
      data: {
        value: { how: 'text' },
      },
    },
  })

  return data
}

interface IProductModel {
  index: string
  name: string
  state: {
    hot: boolean
    unbox: boolean
    image: boolean
    creditCard: boolean
    lastSpecial: boolean
  }
  price: {
    source: number
    special?: number
  }
}

interface IGroupModel {
  name: string
  products: IProductModel[]
}

interface ICategorySummaryModel {
  all: number
  hot: number
  image: number
  change: number
  discuss: number
  limited: number
}

interface ICategoryModel {
  index: number
  name: string
  summary: ICategorySummaryModel
  groups: IGroupModel[]
}

interface IEvaluatePageModel {
  updatedAt: Date
  indexs: any
  categories: ICategoryModel[]
}

interface IProductInfoDetailModel {
  value: string
}

interface IProductInfoPageModel {
  image: string
  detail: IProductInfoDetailModel[]
}
