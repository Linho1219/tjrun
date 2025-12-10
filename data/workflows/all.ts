import type { Page } from 'playwright'
import type { RootItem, TreeItem } from '..'
import { sleep } from '../utils'

export namespace All {
  export interface ServiceItem {
    itemWid: string
    itemName: string
    itemPinYin: string
    itemCategory: string
    workGuide: boolean
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

// already included in other places
const blacklist = [
  'Canvas',
  '教学一体化系统',
  '媒资库 | 录课回看',
  '云媒体',
  'iTongji-S',
  '就业系统',
  '“卓越·星”计划',
  'AI应用创新平台',
  '代码仓库平台（gitlab）',
  '一卡通系统',
  '一卡通流水查询',
  '图书馆系统',
  '图书馆研习室预约',
  '图书馆座位预约',
  '图书馆人流量查询',
  '图书借阅',
  '图片库',
  '统一身份认证自助服务',
  '学生电子证明文件',
  '信息公开',
  '一卡通基本信息查询',
  '人才招聘网',
  '同济云盘',
  '体育场馆预约',
  '同济WPS 356教育版激活',
]

function getUrl(item: All.ServiceItem): string {
  if (item.workGuide)
    return `https://all.tongji.edu.cn/new/index.html#/?pageCode=itemDetail&wid=${item.itemWid}`
  else
    return `https://all.tongji.edu.cn/simJump?id=${item.itemWid}&name=${encodeURIComponent(item.itemName)}&isOnline=1`
}

function toTree(raw: All.Response): RootItem {
  const root: RootItem = {
    name: '一网通办',
    url: 'https://all.tongji.edu.cn/',
    children: [],
  }
  const items = raw.data.serviceItemList.map((v) => v.datas).flat()
  const categorys = new Map<string, TreeItem>()
  items
    .filter(({ itemName }) => !blacklist.some((b) => b === itemName))
    .forEach((item) => {
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
        url: getUrl(item),
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
