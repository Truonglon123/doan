import ProductApi from "@/api/Product"
import CardProduct from "@/Components/CardProduct"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem } from "@/Components/ui/carousel"
import { Skeleton } from "@/Components/ui/skeleton"
import { IProduct } from "@/Interfaces/Product.interface"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"

const OldBook = () => {
    const categoryID = 24
    const [products, setProducts] = useState<IProduct[]>([])
    const [loading, setLoading] = useState(true)

    const fetchProductByCategory = async (categoryID: number) => {
        try {
            const response = await ProductApi.getProductByCategory(categoryID)
            const limitedProducts = response.data.slice(0, 10);
            setProducts(limitedProducts)
            setLoading(false)
        } catch (error) {
            console.log('Lỗi khi lấy danh sách sách cũ ', error)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProductByCategory(categoryID)
    }, [])

    return (
        <section className="mb-12">
            <h3 className="text-3xl font-medium text-start">Sách cũ</h3>
            <div className="mt-6">
                {loading ? (
                    <div className="flex flex-col space-y-3">
                        <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                ) : (
                    <Carousel>
                        <CarouselContent>
                            {products.map((product) => (
                                <CarouselItem className="md:basis-1/2 lg:basis-1/4" key={product.id}>
                                    <CardProduct
                                        productName={product.name}
                                        productThumb={product.images[0].src}
                                        productPrice={product.regular_price}
                                        productPriceSale={product.price}
                                        productSlug={product.slug}
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                )}
            </div>
            <div className="mt-6">
                <Link to={'/category/sach-cu'}>
                    <Button className="hover:cursor-pointer">Xem thêm</Button>
                </Link>
            </div>
        </section>
    )
}

export default OldBook