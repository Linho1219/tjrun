import type { Page } from 'playwright'
import type { RootItem, TreeItem } from '..'
import { sleep } from '../utils'

export namespace All {
  export interface ServiceItem {
    itemWid: string
    itemName: string
    itemPinYin: string
    itemCategory: string
  }

  export interface Response {
    errcode: string
    errmsg: string
    data: {
      serviceItemList: {
        datas: ServiceItem[]
      }[]
    }
  }
}

const urlBase = 'https://all.tongji.edu.cn/new/index.html#/?pageCode=itemDetail&wid='
function toTree(raw: All.Response): RootItem {
  const root: RootItem = {
    name: '一网通办',
    url: 'https://all.tongji.edu.cn/',
    alias: '办事大厅',
    children: [],
  }
  const items = raw.data.serviceItemList.map((v) => v.datas).flat()
  const categorys = new Map<string, TreeItem>()
  items.forEach((item) => {
    if (!categorys.has(item.itemCategory)) {
      const categoryNode: TreeItem = {
        name: item.itemCategory,
        children: [],
      }
      categorys.set(item.itemCategory, categoryNode)
      root.children!.push(categoryNode)
    }
    categorys.get(item.itemCategory)!.children!.push({
      name: item.itemName,
      url: urlBase + item.itemWid,
    })
  })
  return root
}

export async function fetchAllData(page: Page): Promise<RootItem> {
  await page.goto('https://all.tongji.edu.cn/')
  await page.waitForURL('https://all.tongji.edu.cn/new/index.html#/')
  await page.waitForLoadState('domcontentloaded')
  await sleep(5000)
  const raw = await page.evaluate(async () => {
    const fullCardWid = 6393971575863979
    const fullCardUrl = `https://all.tongji.edu.cn/execCardMethod/${fullCardWid}/CUS_CARD_TJQBSX`
    const res = await fetch(fullCardUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cardId: 'CUS_CARD_TJQBSX',
        cardWid: String(fullCardWid),
        method: 'renderData',
        n: Math.random(),
        param: {
          lang: 'zh_CN',
          pageNumber: 1,
          pageSize: 1000,
        },
      }),
    })
    return await res.text()
  })
  console.log('一网通办数据获取完成')
  return toTree(JSON.parse(raw))
}
