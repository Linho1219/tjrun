import 'dotenv/config'
import fs from 'fs/promises'
import { chromium, type Page } from 'playwright'
import { manualMaintainedData } from './manual.data'
import { fetchOneData } from './workflows/one'
import { fetchAllData } from './workflows/all'
import { fetchSoftwareData } from './workflows/software'
import { fetchNicData } from './workflows/nic'
import { sleep } from './utils'

export interface TreeItem {
  name: string
  url?: string
  children?: TreeItem[]
  description?: string
  alias?: string
}
export interface RootItem extends TreeItem {
  url: string
}

const workflows = [fetchOneData, fetchAllData, fetchSoftwareData, fetchNicData]
export async function fetchData(workflows: ((page: Page) => Promise<RootItem>)[]) {
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
    results.push(result)
    await workflowPage.close()
  }
  await browser.close()
  return results
}

function flatten(root: TreeItem) {
  const path: { name: string; alias?: string; url?: string }[] = []
  const result: FlattenedItem[] = []
  function indexRec(item: TreeItem) {
    if (item.url) {
      result.push({
        name: item.name,
        url: item.url,
        path: path.map((p) => ({ name: p.name, url: p.url })),
        pathLabel: path.map((p) => p.name + (p.alias ? ` (${p.alias})` : '')).join(' - '),
        description: item.description || undefined,
        alias: item.alias || undefined,
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

async function main() {
  const fetched = await fetchData(workflows)
  const data = [...fetched, ...manualMaintainedData]
  const flattened = data.map(flatten).flat()
  await fs.writeFile('./public/indexed.json', JSON.stringify(flattened, null, 2), 'utf-8')
}
main()
