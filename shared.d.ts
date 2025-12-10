interface FlattenedItem {
  /** 项目名称 */
  name: string
  /** 项目链接 */
  url: string
  /**
   * 数组形式的项目路径
   * 每项包含名称和可选链接
   */
  path: {
    name: string
    alias?: string
    url?: string
  }[]
  /** 项目描述 */
  description?: string
  /** 项目别名 */
  alias?: string
  /** 项目优先级 */
  priority?: number
}
