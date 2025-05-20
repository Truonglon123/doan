import ProductApi from '@/api/Product';
import CardProduct from '@/Components/CardProduct';
import QuantitySelector from '@/Components/QuantitySelector';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem } from '@/Components/ui/carousel';
import { useAuth } from '@/Context/AuthContext';
import { CalculateDiscount } from '@/Helpers/CalculateDiscount';
import formatVND from '@/Helpers/FormatVND';
import { IProductCart } from '@/Interfaces/Product.interface';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import { useEffect, useState, FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from "@/Context/CartContext";
interface MetaData {
    key: string;
    value: string;
}

interface Image {
    src: string;
}

interface Product {
    name: string;
    price: number;
    regular_price: number;
    images: Image[];
    meta_data: MetaData[];
    description: string;
}

const mockProducts: Product[] = [
    {
        name: '100 kỹ năng sinh tồn',
        price: 200000,
        regular_price: 100000,
        images: [{ src: '../image_195509_1_46272.webp' }],
        meta_data: [],
        description: '',
    },
];

const getMetaValue = (metaData: MetaData[], key: string): string | null => metaData.find((meta) => meta.key === key)?.value ?? null;

const ProductDetail: FC = () => {
    const { addProductToCart } = useCart();
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [productByCategories, setProductByCategories] = useState<Product | null>(null);
    const [numberProduct, setNumberProduct] = useState<number>(1);

    const { authData } = useAuth();

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const response = await ProductApi.productDetai(slug ?? '');
                setProduct(response.data[0]);
                setLoading(false)
            } catch (error) {
                console.error('Lỗi detail product', error);
                setLoading(false)
            }
        };

        fetchProductDetail();
    }, [slug]);

    const fetchProductByCategory = async (categoryId: number) => {
        try {
            const response = await ProductApi.getProductByCategory(categoryId)
            setProductByCategories(response.data)
        } catch (error) {
            console.log('lỗi lấy danh sách gợi ý ', error)
        }
    }
    useEffect(() => {
        if (product) {
            fetchProductByCategory(product.categories[0].id)
        }
    }, [product])

    useEffect(() => {
        Fancybox.bind("[data-fancybox='gallery']", {
            groupAll: true,
            Thumbs: { autoStart: true },
        });
        return () => Fancybox.destroy();
    }, []);

    const handleQuantityChange = (value: number) => setNumberProduct(value);
    const handleBuyNow = () => {
        if (!authData) {
            toast.error("Vui lòng đăng nhập!")
            return
        }
        navigate("/payment", { state: { products: [{ product, quantity: numberProduct }] } });
        console.log(`Mua ngay: ${numberProduct} sản phẩm`)
    };

    const handleAddCard = () => {
        if (!authData) {
            toast.error("Vui lòng đăng nhập!");
            return;
        }
    
        if (!product) return; // Kiểm tra nếu sản phẩm không tồn tại
    
        const productToAdd: IProductCart = {
            id: product.id, 
            name: product.name,
            price: product.price, 
            regular_price: product.regular_price,
            images: product.images,
            quantity: numberProduct, // Truyền số lượng sản phẩm vào đây
        };
    
        addProductToCart(productToAdd);
        toast.success('Sản phẩm được thêm vào giỏ');
    };

    const discount = product ? CalculateDiscount(product.regular_price, product.price) : 0;

    return (
        <div className="my-12">
            {loading ? (
                <div className="flex flex-col justify-center text-center py-12">
                    <div className="mt-4">Đang tải dữ liệu...</div>
                </div>
            ) : (
                <>
                    {product && (
                        <>
                            <div className="grid grid-cols-2 gap-8 w-full mb-12">
                                <div>
                                    <div>
                                        <a href={product.images[0].src} data-fancybox="gallery">
                                            <img src={product.images[0].src} alt={product.name} className="w-full max-h-[624px] object-contain" />
                                        </a>
                                    </div>
                                    <div className='grid grid-cols-4 gap-4 mt-3'>
                                        {product.images.map((img, index) => (
                                            <a key={index} href={img.src} data-fancybox="gallery">
                                                <img src={img.src} alt={product.name} className="w-full" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-start flex flex-col gap-6">
                                    <h2 className="text-2xl font-bold">{product.name}</h2>
                                    <div className="grid grid-cols-2 gap-6">
                                        <span>Tác giả: <strong>{getMetaValue(product.meta_data, 'tac_giả')}</strong></span>
                                        <span>Nhà xuất bản: <strong>{getMetaValue(product.meta_data, 'nha_xuất_bản')}</strong></span>
                                        <span>Ngôn ngữ: <strong>{getMetaValue(product.meta_data, 'ngon_ngữ')}</strong></span>
                                    </div>
                                    <div className='grid grid-cols-3 items-center'>
                                        <strong className="text-red-600 text-2xl">{formatVND(product.price)}</strong>
                                        {discount > 0 ?
                                            <>
                                                <div className="bg-red-600 w-fit text-white px-3 rounded">
                                                    -{discount}%
                                                </div>
                                                <p className="line-through">{formatVND(product.regular_price)}</p>
                                            </>
                                            :
                                            <></>
                                        }
                                    </div>
                                    <QuantitySelector min={1} max={10} onQuantityChange={handleQuantityChange} />
                                    <div className="grid grid-cols-2 gap-6">
                                        <Button variant="destructive" onClick={handleBuyNow}>Mua ngay</Button>
                                        <Button variant="outline" onClick={() => handleAddCard()}>Thêm vào giỏ</Button>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-medium mb-3">Thông tin chi tiết</h3>
                                        <div>
                                            <div className="grid grid-cols-2 border-b py-3">
                                                <p>Tên nhà cung cấp</p>
                                                <strong>{getMetaValue(product.meta_data, 'ten_nha_cung_cấp')}</strong>
                                            </div>
                                            <div className="grid grid-cols-2 border-b py-3">
                                                <p>Tác giả</p>
                                                <strong>{getMetaValue(product.meta_data, 'tac_giả')}</strong>
                                            </div>
                                            <div className="grid grid-cols-2 border-b py-3">
                                                <p>Người dịch</p>
                                                <strong>{getMetaValue(product.meta_data, 'nguời_dịch')}</strong>
                                            </div>
                                            <div className="grid grid-cols-2 border-b py-3">
                                                <p>Nhà xuất bản</p>
                                                <strong>{getMetaValue(product.meta_data, 'nha_xuất_bản')}</strong>
                                            </div>
                                            <div className="grid grid-cols-2 border-b py-3">
                                                <p>Năm xuất bản</p>
                                                <strong>{getMetaValue(product.meta_data, 'nam_xuất_bản')}</strong>
                                            </div>
                                            <div className="grid grid-cols-2 border-b py-3">
                                                <p>Ngôn ngữ</p>
                                                <strong>{getMetaValue(product.meta_data, 'ngon_ngữ')}</strong>
                                            </div>
                                            <div className="grid grid-cols-2 border-b py-3">
                                                <p>Trọng lượng</p>
                                                <strong>{getMetaValue(product.meta_data, 'trọng_luợng')}</strong>
                                            </div>
                                            <div className="grid grid-cols-2 border-b py-3">
                                                <p>Kích thước</p>
                                                <strong>{getMetaValue(product.meta_data, 'kich_thuớc')}</strong>
                                            </div>
                                            <div className="grid grid-cols-2 border-b py-3">
                                                <p>Số trang</p>
                                                <strong>{getMetaValue(product.meta_data, 'số_trang')}</strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-start mb-12">
                                <h3 className="text-xl font-medium mb-3 text-center">Mô tả sản phẩm</h3>
                                <div dangerouslySetInnerHTML={{ __html: product.description }} className="space-y-6" />
                            </div>
                        </>
                    )}
                </>
            )}
            <div>
                <h3 className="text-2xl font-bold mb-8">Sản phẩm cùng thể loại</h3>
                <Carousel>
                    <CarouselContent>
                        {productByCategories?.map((p, index) => (
                            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
                                <CardProduct
                                    productName={p.name}
                                    productThumb={p.images[0]?.src ?? ''}
                                    productPrice={p.regular_price}
                                    productPriceSale={p.price}
                                    productSlug={slug ?? ''}
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </div>
    );
};

export default ProductDetail;
