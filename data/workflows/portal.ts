import type { Page } from 'playwright'
import type { RootItem } from '..'
import { sleep } from '../utils'

const targetPages = [
  'https://www.tongji.edu.cn/yxjg111/ybshe_zhi/ybsz_.htm',
  'https://www.tongji.edu.cn/yxjg111/dzbm.htm',
  'https://www.tongji.edu.cn/yxjg111/zsdw1.htm',
  'https://www.tongji.edu.cn/yxjg111/fsdwjzgqy.htm',
]

const blacklist: string[] = []
const renameMap: Record<string, string> = {
  '党委学生工作部（学生处、党委研究生工作部、': '党委学生工作部（学生处、党委研究生工作部 学工部）',
  '武装部）': '武装部',
}
const aliasMap: Record<string, string> = {
  关心下一代工作委员会: '关工委',
  妇委: '同济女性 妇女研究中心 妇联',
  '继续教育学院、网络教育学院': '成人教育',
  团委: '同济青年 共青团',
}

export async function fetchPortalData(page: Page): Promise<RootItem[]> {
  const roots: RootItem[] = []
  for (const pageurl of targetPages) {
    await page.goto(pageurl)
    await page.waitForLoadState('networkidle')
    await sleep(1000)
    const raw = await page.evaluate(async () => {
      const nodes = [
        ...(document.querySelectorAll('.section-right li a') as NodeListOf<HTMLAnchorElement>),
      ]
        .map((a) => ({ name: a.innerText, url: a.href }))
        .filter(({ url }) => !url.startsWith(location.href))
      return JSON.stringify(nodes)
    })
    const items: RootItem[] = (JSON.parse(raw) as { name: string; url: string }[])
      .filter((item) => !blacklist.includes(item.name))
      .map((item) => {
        if (item.name in renameMap) item.name = renameMap[item.name]!
        const reg = / *[（\(](.+?)[）\)]$/
        const aliasList: string[] = []
        if (item.name in aliasMap) aliasList.push(aliasMap[item.name]!)
        const match = item.name.match(reg)
        if (match && match[1]) {
          aliasList.push(match[1])
          item.name = item.name.replace(reg, '')
        }
        return { ...item, alias: aliasList.join(' ') || undefined }
      })
    roots.push(...items)
  }
  console.log('门户网站数据抓取完成')
  return roots
}
