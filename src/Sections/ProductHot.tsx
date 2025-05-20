import ProductApi from "@/api/Product"
import CardProduct from "@/Components/CardProduct"
import { Carousel, CarouselContent, CarouselItem } from "@/Components/ui/carousel"
import { Skeleton } from "@/Components/ui/skeleton"
import { IProduct } from "@/Interfaces/Product.interface"
import { Flame } from "lucide-react"
import { useEffect, useState } from "react"

const ProductHot = () => {
    const [products, setProducts] = useState<IProduct[]>([])
    const [loading, setLoading] = useState(true)

    const fetchProducts = async () => {
        try {
            const response = await ProductApi.product();
            const filteredProducts = response.data.filter(
                (product:any) =>
                    product.meta_data.some(
                        (meta:any) => meta.key === "hot" && meta.value === "1"
                    )
            );
            setProducts(filteredProducts.slice(0, 10));
            setLoading(false)
        } catch (error) {
            console.error("Lỗi gọi api sản phẩm hot: ", error);
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <section className="mb-12">
            <div className="flex items-center gap-5">
                <h3 className="text-3xl font-medium text-red-600">Sách nổi bật</h3>
                <Flame className="text-red-600" />
            </div>
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
        </section>
    )
}

export default ProductHot