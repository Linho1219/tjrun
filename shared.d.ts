interface FlattenedItem {
  name: string
  url: string
  path: {
    name: string
    url?: string
  }[]
  pathLabel: string
  description?: string
  alias?: string
}
