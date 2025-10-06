import 'dotenv/config'
import fs from 'fs/promises'
import { chromium, type Page } from 'playwright'
import { sleep } from './utils'
import { manualMaintainedData } from './manual.data'
import { fetchOneData } from './workflows/one'
import { fetchAllData } from './workflows/all'
import { fetchSoftwareData } from './workflows/software'
import { fetchNicData } from './workflows/nic'
import { fetchPortalData } from './workflows/portal'

export interface TreeItem {
  name: string
  url?: string
  children?: TreeItem[]
  description?: string
  alias?: string
  priority?: number
}
export interface RootItem extends TreeItem {
  url: string
}

const workflows: ((page: Page) => Promise<RootItem | RootItem[]>)[] = [
  fetchOneData,
  fetchAllData,
  fetchSoftwareData,
  fetchNicData,
  fetchPortalData,
]
async function fetchData(workflows: ((page: Page) => Promise<RootItem | RootItem[]>)[]) {
  const browser = await chromium.launchPersistentContext('./auth', { headless: false })
  const loginPage = await browser.newPage()
  await loginPage.goto('https://iam.tongji.edu.cn/')

  const uid = process.env.UID
  const pwd = process.env.PWD
  if (uid) {
    await loginPage.locator('#j_username').click()
    await loginPage.keyboard.type(uid)
  }
  if (pwd) {
    await loginPage.locator('#j_password').click()
    await loginPage.keyboard.type(pwd)
  }
  if (uid && pwd) {
    await sleep(1000)
    await loginPage.locator('#loginButton').click()
  }
  await loginPage.waitForURL('https://iam.tongji.edu.cn/self-service/')
  await loginPage.close()
  const results: RootItem[] = []
  for (const workflow of workflows) {
    const workflowPage = await browser.newPage()
    const result = await workflow(workflowPage)
    if (Array.isArray(result)) results.push(...result)
    else results.push(result)
    await workflowPage.close()
  }
  await browser.close()
  await fs.writeFile('./auth/fetch-cache.json', JSON.stringify(results), 'utf-8')
  return results
}

export function flatten(root: TreeItem) {
  const path: { name: string; alias?: string; url?: string }[] = []
  const result: FlattenedItem[] = []
  function indexRec(item: TreeItem) {
    if (item.url) {
      result.push({
        name: item.name,
        url: item.url,
        path: path.map((p) => ({ name: p.name, url: p.url })),
        pathLabel:
          path.map((p) => p.name + (p.alias ? ` (${p.alias})` : '')).join(' - ') || undefined,
        description: item.description || undefined,
        alias: item.alias || undefined,
        priority: item.priority || undefined,
      })
    }
    if (item.children === undefined || item.children.length === 0) return
    path.push({ name: item.name, url: item.url, alias: item.alias })
    for (const child of item.children) indexRec(child)
    path.pop()
  }
  indexRec(root)
  return result
}

export async function fetchdata() {
  const fetched = await fetchData(workflows)
  const data = [...fetched, ...manualMaintainedData]
  const flattened = data.map(flatten).flat()
  await fs.writeFile('./public/indexed.json', JSON.stringify(flattened), 'utf-8')
}

export async function updmanual() {
  try {
    const fetchedJSON = await fs.readFile('./auth/fetch-cache.json', 'utf-8')
    const fetcheditems = JSON.parse(fetchedJSON) as RootItem[]
    const data = [...fetcheditems, ...manualMaintainedData]
    const flattened = data.map(flatten).flat()
    await fs.writeFile('./public/indexed.json', JSON.stringify(flattened), 'utf-8')
  } catch (error) {
    if (error instanceof Error && error.message.includes('no such file or directory'))
      console.error('fetch-cache.json 文件不存在，请先运行数据抓取')
    else console.error('Error updating manual data:', error)
  }
}
