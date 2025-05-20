export interface ICategory {
    id: string
    name: string
    slug: string
    parent_id?: string | null
    description?: string
}
