import { Link } from "react-router-dom"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import formatVND from "@/Helpers/FormatVND"

interface ProductProps {
    productName: string,
    productThumb: string,
    productPrice: number,
    productPriceSale?: number | null
    productSlug: string
}

const CardProduct: React.FC<ProductProps> = ({ productName, productThumb, productPrice, productPriceSale, productSlug }) => {
    return (
        <Card className="h-full justify-between">
            <Link to={`/product/${productSlug}`}>
                <CardHeader>
                    <img src={productThumb} alt={productName} loading="lazy" className="h-64 object-contain" />
                </CardHeader>
                <CardContent className="mt-6">
                    <CardTitle>{productName}</CardTitle>
                </CardContent>
            </Link>
            <CardFooter className="flex justify-between">
                {productPriceSale ? (
                    <>
                        <p>Giá: <span className="text-red-500 font-medium">{formatVND(productPriceSale)}</span></p>
                        <p className="line-through">{formatVND(productPrice)}</p>
                    </>
                ) : (
                    <p>Giá: <span className="text-red-500 font-medium">{formatVND(productPrice)}</span></p>
                )}
            </CardFooter>
        </Card>

    )
}

export default CardProduct