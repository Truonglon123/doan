import CategoryApi from "@/api/Category";
import ProductApi from "@/api/Product";
import CardProduct from "@/Components/CardProduct";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Skeleton } from "@/Components/ui/skeleton";
import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { Label } from "@/components/ui/label";

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Product {
    id: string;
    name: string;
    images?: { src: string }[];
    price: number;
    regular_price: number;
    slug: string;
}

const priceRanges = [
    { min: 0, max: 150000, title: "0 - 150.000 đ" },
    { min: 150000, max: 300000, title: "150.000 đ - 300.000 đ" },
    { min: 300000, max: 500000, title: "300.000 đ - 500.000 đ" },
    { min: 500000, max: 9999999999, title: "500.000 đ trở lên" },
    { min: 0, max: 9999999999, title: "Tất cả" }
];

const CategoryPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const [category, setCategory] = useState<Category | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState({ category: true, product: true });
    const [selectedPriceRange, setSelectedPriceRange] = useState({ min: 0, max: 9999999999 });

    // Lấy danh sách danh mục
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await CategoryApi.category();
                setCategories(response.data);
            } catch (error) {
                console.error("Lỗi khi gọi API category: ", error);
            } finally {
                setLoading((prev) => ({ ...prev, category: false }));
            }
        };
        fetchCategories();
    }, []);

    // Lấy chi tiết danh mục theo slug
    const fetchDetailCategory = useCallback(async () => {
        if (!slug) return;
        setLoading((prev) => ({ ...prev, product: true }));

        try {
            const response = await CategoryApi.getIdBySlug(slug);
            setCategory(response.data[0]);
        } catch (error) {
            console.error("Lỗi lấy thông tin category detail ", error);
        } finally {
            setLoading((prev) => ({ ...prev, product: false }));
        }
    }, [slug]);

    // Lấy danh sách sản phẩm theo danh mục & khoảng giá
    const fetchProductsByCategory = useCallback(async (categoryId: number) => {
        setLoading((prev) => ({ ...prev, product: true }));

        try {
            const response = await ProductApi.getProductByCategory(categoryId, selectedPriceRange.min, selectedPriceRange.max);
            setProducts(response.data);
        } catch (error) {
            console.error("Lỗi lấy danh sách theo id category ", error);
        } finally {
            setLoading((prev) => ({ ...prev, product: false }));
        }
    }, [selectedPriceRange]);

    // Gọi API khi `slug` thay đổi
    useEffect(() => {
        fetchDetailCategory();
    }, [slug, fetchDetailCategory]);

    // Gọi API khi danh mục hoặc khoảng giá thay đổi
    useEffect(() => {
        if (category?.id) {
            fetchProductsByCategory(category.id);
        }
    }, [category, selectedPriceRange, fetchProductsByCategory]);

    return (
        <div className="grid grid-cols-4 w-full gap-12">
            {/* Sidebar bộ lọc */}
            <div className="flex flex-col gap-6 text-start border-r border-dashed pr-4">
                {/* Danh mục sản phẩm */}
                <div>
                    <h3 className="text-xl font-medium mb-3">Danh mục</h3>
                    <div className="flex flex-col gap-1 ml-1">
                        {loading.category ? (
                            <>
                                <Skeleton className="h-4 w-[250px]" />
                                <Skeleton className="h-4 w-[200px]" />
                            </>
                        ) : (
                            categories.map((cat) => (
                                <Link
                                    to={`/category/${cat.slug}`}
                                    key={cat.id}
                                    className={`text-base hover:bg-accent p-2 
                                    ${slug === cat.slug ? "text-red-500 font-bold" : ""}`}
                                >
                                    {cat.name}
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                {/* Lọc theo giá */}
                <div>
                    <h3 className="text-xl font-medium mb-4">Giá</h3>
                    <div className="flex flex-col gap-1 ml-1">
                        <RadioGroup
                            defaultValue="0-9999999999"
                            onValueChange={(value) => {
                                const [min, max] = value.split("-").map(Number);
                                setSelectedPriceRange({ min, max });
                            }}
                        >
                            {priceRanges.map((range, index) => (
                                <div className="flex items-center space-x-2" key={index}>
                                    <RadioGroupItem value={`${range.min}-${range.max}`} id={`price-${index}`} />
                                    <Label htmlFor={`price-${index}`} className="font-normal text-base">
                                        {range.title}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="col-span-3">
                {loading.product ? (
                    <div className="grid grid-cols-3 gap-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex flex-col space-y-3">
                                <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[250px]" />
                                    <Skeleton className="h-4 w-[200px]" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3">
                        {products.map((product) => (
                            <CardProduct
                                key={product.id}
                                productName={product.name}
                                productThumb={product.images?.[0]?.src || "/fallback.jpg"}
                                productPrice={product.regular_price}
                                productPriceSale={product.price}
                                productSlug={product.slug}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 text-lg">Không có sản phẩm nào phù hợp...</div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
