import type { Page } from 'playwright'
import type { RootItem } from '..'
import { sleep } from '../utils'

const urlBase = 'https://software.tongji.edu.cn/product.html?id='

namespace Software {
  export interface ServiceItem {
    name: string
    shortName: string
    downloadPath0: string
    downloadPath1: string
    downloadPath2: string
    softwareId: number
    details: string
  }

  export interface Response {
    msg: string
    code: number
    data: {
      menuName: string
      childMenusList: {
        menuName: string
        softs: ServiceItem[]
      }[]
    }[]
  }
}

function toTree(raw: Software.Response): RootItem {
  return {
    name: '正版化服务平台',
    url: 'https://software.tongji.edu.cn/',
    alias: '正版软件 软件下载',
    children: raw.data.map((category) => ({
      name: prettyPrintName(category.menuName),
      children: category.childMenusList.map((subCategory) => ({
        name: prettyPrintName(subCategory.menuName),
        children: subCategory.softs.map((service) => ({
          name: prettyPrintName(service.name),
          url: urlBase + service.softwareId,
          alias: service.shortName,
        })),
      })),
    })),
  }
}

const prettyPrintName = (name: string) =>
  name
    .replace(/[-_]/g, ' ')
    .trim()
    .replace(/(?<=[^ ])\(/g, ' (')
    .replace(/\)(?=[^ ])/g, ') ')

export async function fetchSoftwareData(page: Page): Promise<RootItem> {
  await page.goto('https://software.tongji.edu.cn/')
  await page.waitForURL('https://software.tongji.edu.cn/index.html')
  await page.waitForLoadState('networkidle')
  await sleep(2000)
  const raw = await page.evaluate(async () => {
    const url = 'https://software.tongji.edu.cn/prod-api/index/double/softwareTypes'
    const res = await fetch(url, {
      headers: {
        Authorization: 'Bearer ' + (await cookieStore.get('Admin-Token'))?.value,
      },
    })
    return await res.text()
  })
  console.log('正版化服务平台数据获取完成')
  return toTree(JSON.parse(raw))
}
