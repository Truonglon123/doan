import { ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./ui/sheet";
import QuantitySelector from "./QuantitySelector";
import { IProductCart } from "@/Interfaces/Product.interface";
import { useCart } from "@/Context/CartContext";
import formatVND from "@/Helpers/FormatVND";
import { useNavigate } from "react-router-dom";

const Cart = () => {
    const navigate = useNavigate();
    const { products, selectAll, total, handleQuantityChange, handleDelete, handleSelect, handleSelectAll } = useCart();

    // Kiểm tra xem có sản phẩm nào được chọn hay không
    const isDisabled = !products.some((product) => product.checked);

    const handlePayment = () => {
        const selectedProducts = products
            .filter((product) => product.checked)
            .map(({ id, name, quantity, price, regular_price, images }) => ({
                id,
                name,
                quantity,
                price: Number(price), // Ép kiểu thành số
                regular_price,
                images,
            }));

        if (selectedProducts.length === 0) return; // Không có sản phẩm nào được chọn

        navigate("/payment", { state: { products: selectedProducts } });
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">
                    <ShoppingCart />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Giỏ hàng</SheetTitle>
                    <SheetDescription>
                        Vui lòng chọn số lượng và sản phẩm cần mua để thanh toán.
                    </SheetDescription>
                </SheetHeader>

                {/* Chọn tất cả */}
                <div className="flex items-center gap-3 border-b border-dashed px-3 py-2">
                    <Checkbox id="select-all" checked={selectAll} onCheckedChange={handleSelectAll} />
                    <label htmlFor="select-all">Chọn tất cả</label>
                </div>

                {/* Danh sách sản phẩm */}
                <div className="grid gap-4 px-3 py-4">
                    {products.map((product) => (
                        <CartItem
                            key={product.id}
                            product={product}
                            onSelect={handleSelect}
                            onQuantityChange={handleQuantityChange}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>

                {/* Footer giỏ hàng */}
                <SheetFooter>
                    <div>
                        <p>Cần thanh toán: <strong>{total.toLocaleString()} đ</strong></p>
                    </div>
                    <SheetClose asChild>
                        <Button type="submit" variant="destructive" disabled={isDisabled} onClick={handlePayment}>
                            Thanh toán
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

const CartItem = ({
    product,
    onSelect,
    onQuantityChange,
    onDelete,
}: {
    product: IProductCart;
    onSelect: (id: number) => void;
    onQuantityChange: (id: number, value: number) => void;
    onDelete: (id: number) => void;
}) => {
    return (
        <div className="grid grid-cols-4 gap-3 items-center border-y border-dashed py-3">
            <div className="col-span-1 flex items-center gap-2">
                <Checkbox
                    id={`product-${product.id}`}
                    checked={product.checked}
                    onCheckedChange={() => onSelect(product.id)}
                />
                <img src={product.images[0].src} alt={product.name} className="w-16 h-16 object-cover rounded" />
            </div>
            <div className="col-span-2">
                <p className="truncate">{product.name}</p>
                <div className="flex gap-3">
                    <strong className="text-destructive">{formatVND(product.price)}</strong>
                    <span className="line-through">{formatVND(product.regular_price)}</span>
                </div>
                {/* Chỉnh sửa số lượng */}
                <QuantitySelector
                    max={10}
                    min={1}
                    value={product.quantity}
                    onQuantityChange={(value: number) => onQuantityChange(product.id, value)}
                />
            </div>
            <div>
                <Button variant="destructive" onClick={() => onDelete(product.id)}>
                    <Trash2 />
                </Button>
            </div>
        </div>
    );
};

export default Cart;
