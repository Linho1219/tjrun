import type { Page } from 'playwright'
import type { RootItem } from '..'
import { sleep } from '../utils'

const targetPages = [
  'https://www.tongji.edu.cn/yxjg111/ybshe_zhi/ybsz_.htm',
  'https://www.tongji.edu.cn/yxjg111/dzbm.htm',
  'https://www.tongji.edu.cn/yxjg111/zsdw1.htm',
  'https://www.tongji.edu.cn/yxjg111/fsdwjzgqy.htm',
]

const blacklist: string[] = ['上海同济后勤产业发展有限公司']
const renameMap: Record<string, string> = {
  '党委学生工作部（学生处、党委研究生工作部、': '党委学生工作部（学生处、党委研究生工作部 学工部）',
  '武装部）': '武装部',
}
const aliasMap: Record<string, string> = {
  关心下一代工作委员会: '关工委',
  妇委: '同济女性 妇女研究中心 妇联',
  '继续教育学院、网络教育学院': '成人教育',
  团委: '同济青年 共青团',
  文科建设处: '人文社会科学信息网',
  国有资产管理委员会办公室: '国资委',
  '党委宣传部（宣传处）': '新闻网 宣传中心 快讯 要闻',
  就业指导中心: '就业系统 就业平台',
  附属同济医院分院: '校医院',
  出版社有限公司: '出版社',
  电子与信息工程学院: '电信',
  政治与国际关系学院: '国政',
  航空航天与力学学院: '航力',
  艺术与传媒学院: '艺传',
  '计算机科学与技术学院（软件学院）': '计科 软工',
  建筑与城市规划学院: '城规',
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
        .map((a) => ({ name: a.innerText.trim(), url: a.href }))
        .filter(({ url }) => !url.startsWith(location.href))
      return JSON.stringify(nodes)
    })
    const items: RootItem[] = (JSON.parse(raw) as { name: string; url: string }[])
      .filter((item) => !blacklist.includes(item.name))
      .map((item) => {
        if (item.name.startsWith('同济大学')) item.name = item.name.substring(4)
        if (item.name in renameMap) item.name = renameMap[item.name]!
        const reg = /[（\(](.+?)[）\)]$/
        const aliasList: string[] = []
        if (item.name in aliasMap) aliasList.push(aliasMap[item.name]!)
        const match = item.name.match(reg)
        if (match && match[1]) {
          aliasList.push(match[1])
          item.name = item.name.replace(reg, '').trim()
        }
        return { ...item, alias: aliasList.join(' ') || undefined }
      })
    roots.push(...items)
  }
  console.log('门户网站数据抓取完成')
  return roots
}
