import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { IProductCart } from "@/Interfaces/Product.interface";

interface CartContextType {
    products: IProductCart[];
    numberProduct: number
    selectAll: boolean;
    total: number;
    handleQuantityChange: (id: number, value: number) => void;
    handleDelete: (id: number) => void;
    handleSelect: (id: number) => void;
    handleSelectAll: () => void;
    addProductToCart: (product: IProductCart) => void; // Hàm thêm sản phẩm vào giỏ
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [products, setProducts] = useState<IProductCart[]>([]);
    const [selectAll, setSelectAll] = useState(false);

    // Lấy giỏ hàng từ LocalStorage khi component mount
    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            const parsedCart = JSON.parse(storedCart);
            const updatedCart = parsedCart.map((item: IProductCart) => ({
                ...item,
                checked: item.checked ?? false, // Ensure each product has a "checked" field
            }));
            setProducts(updatedCart);
        }
    }, []);

    // Cập nhật LocalStorage khi giỏ hàng thay đổi
    useEffect(() => {
        if (products.length > 0) {
            // Chỉ lưu những trường cần thiết vào LocalStorage
            const simplifiedProducts = products.map((product) => ({
                id: product.id,
                name: product.name,
                price: product.price ?? 0, // Nếu không có giá, mặc định là 0
                regular_price: product.regular_price,
                quantity: product.quantity,
                images: product.images || [], // Nếu không có hình ảnh, lưu mảng rỗng
            }));
            localStorage.setItem("cart", JSON.stringify(simplifiedProducts));
        }
    }, [products]);

    // Hàm thêm sản phẩm vào giỏ
    const addProductToCart = useCallback((product: IProductCart) => {
        setProducts((prev) => {
            const existingProductIndex = prev.findIndex((p) => p.id === product.id);
            if (existingProductIndex !== -1) {
                // Nếu sản phẩm đã có trong giỏ, cập nhật số lượng
                const updatedProducts = [...prev];
                updatedProducts[existingProductIndex].quantity += product.quantity;
                return updatedProducts;
            } else {
                // Nếu sản phẩm chưa có trong giỏ, thêm mới với số lượng
                return [...prev, { ...product }];
            }
        });
    }, []);    

    // Cập nhật số lượng sản phẩm
    const handleQuantityChange = useCallback((id: number, value: number) => {
        setProducts((prev) =>
            prev.map((product) =>
                product.id === id ? { ...product, quantity: value } : product
            )
        );
    }, []);

    // Xóa sản phẩm khỏi giỏ hàng
    const handleDelete = useCallback((id: number) => {
        setProducts((prev) => {
            const updatedProducts = prev.filter((product) => product.id !== id);
            localStorage.setItem("cart", JSON.stringify(updatedProducts)); // Cập nhật localStorage
            return updatedProducts;
        });
    }, []);

    // Chọn / bỏ chọn sản phẩm
    const handleSelect = useCallback((id: number) => {
        setProducts((prev) => {
            const updatedProducts = prev.map((product) =>
                product.id === id ? { ...product, checked: !product.checked } : product
            );
            setSelectAll(updatedProducts.every((product) => product.checked));
            return updatedProducts;
        });
    }, []);

    // Chọn / bỏ chọn tất cả
    const handleSelectAll = () => {
        const newChecked = !selectAll;
        setSelectAll(newChecked);
        setProducts((prev) =>
            prev.map((product) => ({ ...product, checked: newChecked }))
        );
    };

    // Tính tổng tiền các sản phẩm đã chọn
    const total = products.reduce(
        (sum, product) => (product.checked ? sum + product.quantity * (product.price ?? 0) : sum),
        0
    );

    return (
        <CartContext.Provider
            value={{
                products,
                selectAll,
                total,
                handleQuantityChange,
                handleDelete,
                handleSelect,
                handleSelectAll,
                addProductToCart, // Cung cấp hàm addProductToCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
