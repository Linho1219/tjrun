import type { TreeItem } from '..'
import type { Page } from 'playwright'
import { sleep } from '../utils'

namespace One {
  export interface ServiceItem {
    authId: number
    authNameCh: string
    parentAuthId: number
    urlPath: string
  }

  export interface Response {
    code: number
    data: {
      auths: ServiceItem[]
    }
  }
}

interface OneTreeItem extends TreeItem {
  id: number
  children?: OneTreeItem[]
}
interface OneRootItem extends OneTreeItem {
  url: string
}
const blacklistIds = [
  12995, 9618, 16044, 9431, 10437, 12822, 9613, 9883, 9377, 9845, 9869, 9866, 9871, 12308, 11786,
  11787, 11788, 11789, 11800, 11801, 11802, 11803,
] as const
const urlBase = 'https://1.tongji.edu.cn'

function toTree(raw: One.Response): OneRootItem {
  const services = raw.data.auths
  const idMap = new Map<number, OneTreeItem>()
  const rootItem: OneTreeItem = {
    name: '教学管理信息系统',
    id: -1,
    alias: '1系统 一系统',
    children: [],
    url: urlBase,
  }
  idMap.set(-1, rootItem)
  for (const service of services) {
    const item: OneTreeItem = {
      name: service.authNameCh,
      id: service.authId,
      url: service.urlPath ? urlBase + service.urlPath : undefined,
    }
    idMap.set(service.authId, item)
  }
  for (const service of services) {
    const item = idMap.get(service.authId)
    if (!item) {
      console.warn('item not found', service.authNameCh)
      continue
    }
    const parent = idMap.get(service.parentAuthId)
    if (!parent) {
      console.warn('parent not found', service.authNameCh)
      continue
    }
    if (parent.children === undefined) {
      parent.children = [item]
    } else {
      parent.children.push(item)
    }
  }
  function prune(item: OneTreeItem): OneTreeItem | null {
    if (blacklistIds.some((b) => item.id === b)) return null
    if (!item.children || item.children.length === 0) {
      return item.url ? item : null
    }
    item.children = item.children.map(prune).filter((child): child is OneTreeItem => child !== null)
    if (item.children.length === 0) {
      delete item.children
      return item.url ? item : null
    } else return item
  }

  const pruned = prune(rootItem)
  if (!pruned) throw new Error('root is pruned')
  return pruned as OneRootItem
}

export async function fetchOneData(page: Page): Promise<OneRootItem> {
  await page.goto('https://1.tongji.edu.cn/')
  await page.waitForURL('https://1.tongji.edu.cn/workbench')
  await page.waitForLoadState('networkidle')
  await sleep(2000)
  const raw = await page.evaluate(async () => {
    const url = `https://1.tongji.edu.cn/api/sessionservice/session/getSessionUser?_t=${Date.now()}`
    const res = await fetch(url)
    return await res.text()
  })
  console.log('一系统数据获取完成')
  return toTree(JSON.parse(raw))
}
