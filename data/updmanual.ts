import fs from 'fs/promises'
import { manualMaintainedData } from './manual.data'

async function updmanual() {
  try {
    const data = await fs.readFile('./auth/fetch-cache.json', 'utf-8')
    const items = JSON.parse(data) as FlattenedItem[]
    await fs.writeFile(
      './public/indexed.json',
      JSON.stringify([...items, ...manualMaintainedData]),
      'utf-8',
    )
  } catch (error) {
    if (error instanceof Error && error.message.includes('no such file or directory'))
      console.error('fetch-cache.json 文件不存在，请先运行数据抓取')
    else console.error('Error updating manual data:', error)
  }
}
updmanual()
