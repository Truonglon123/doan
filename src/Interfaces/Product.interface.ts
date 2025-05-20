export interface IProduct {
    id: string
    name: string
    price?: number
    regular_price: number
    thumbnail: string
    slug: string
    description?: string
    quantity: number
}

export interface IProductCart {
    id: string
    name: string
    price?: number
    regular_price: number
    thumbnail: string
    images: string[]
    quantity: number
}