import type { Page } from 'playwright'
import type { RootItem, TreeItem } from '..'
import { sleep } from '../utils'

export async function fetchNicData(page: Page): Promise<RootItem> {
  await page.goto('https://nic.tongji.edu.cn/')
  await page.waitForLoadState('networkidle')
  await sleep(2000)
  const raw = await page.evaluate(() => {
    const targetMenus = ['服务指南', '制度规范', '常见问题']
    const items = targetMenus.map((title) => {
      const ul = document.querySelector(`a[title="${title}"] ~ ul`) as HTMLUListElement | null
      if (!ul) throw new Error(`Cannot find menu: ${title}`)
      ul.style.visibility = 'visible' // make innerText accessible
      return {
        name: title,
        children: [...ul.querySelectorAll('a')].map((a) => ({
          name: a.innerText,
          url: a.href,
        })),
      } as TreeItem
    })
    return JSON.stringify(items)
  })
  const children: TreeItem[] = JSON.parse(raw)
  const root: RootItem = {
    name: '信息化办公室',
    url: 'https://nic.tongji.edu.cn/',
    alias: '信息办 信息中心 nic',
    children,
  }
  console.log('信息办数据获取完成')
  return root
}
