import Order from "@/api/Order";
import { fetchDistricts, fetchProvinces, fetchWards } from "@/Components/Location";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Textarea } from "@/Components/ui/textarea";
import formatVND from "@/Helpers/FormatVND";
import { IProduct } from "@/Interfaces/Product.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

interface CartItem {
    product?: IProduct;
    quantity: number;
    price?: string;
    name?: string;
    images?: { src: string }[];
}

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { products = [] }: { products: CartItem[] } = location.state || {}; // Nhận dữ liệu từ state

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");

    const getProvinceName = (code: string) => {
        const province = provinces.find((p) => String(p.code) === code);
        return province ? province.name : "Không xác định";
    };

    const getDistrictName = (code: string) => {
        const district = districts.find((d) => String(d.code) === code);
        return district ? district.name : "Không xác định";
    };

    const getWardName = (code: string) => {
        const ward = wards.find((w) => String(w.code) === code);
        return ward ? ward.name : "Không xác định";
    };

    useEffect(() => {
        fetchProvinces().then(setProvinces);
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            fetchDistricts(selectedProvince).then(setDistricts);
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) {
            fetchWards(selectedDistrict).then(setWards);
        }
    }, [selectedDistrict]);

    if (!products.length) {
        return <p>Không có sản phẩm để thanh toán.</p>;
    }

    const SHIPPING = 0; // Phí vận chuyển

    // Tính tổng tiền sản phẩm
    const totalPrice = products.reduce((sum, item) =>
        sum + Number(item.product?.price ?? item.price ?? 0) * item.quantity,
        0
    );

    // Tổng tiền thanh toán
    const totalPayment = totalPrice + SHIPPING;

    // Schema xác thực dữ liệu
    const formSchema = z.object({
        username: z.string().min(2, { message: "Tên người dùng quá ngắn." }),
        email: z.string().email({ message: "Email không đúng định dạng." }).optional().or(z.literal("")),
        phone: z.string().regex(/^0\d{9}$/, { message: "Số điện thoại không hợp lệ." }),
        address: z.string(),
        note: z.string().optional(),
    });

    // Form hook
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            phone: "",
            address: "",
            note: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const orderData = {
            payment_method: "cod", // Hoặc "bacs", "paypal"
            payment_method_title: "Cash on Delivery",
            set_paid: false,
            billing: {
                first_name: "",
                last_name: values.username,
                address_1: values.address,
                city: `${getWardName(selectedWard)}, ${getDistrictName(selectedDistrict)}, ${getProvinceName(selectedProvince)}`,
                state: `${getWardName(selectedWard)}, ${getDistrictName(selectedDistrict)}, ${getProvinceName(selectedProvince)}`,
                postcode: "",
                country: "VN",
                email: values.email,
                phone: values.phone
            },
            shipping: {
                first_name: "",
                last_name: values.username,
                address_1: values.address,
                city: `${getWardName(selectedWard)}, ${getDistrictName(selectedDistrict)}, ${getProvinceName(selectedProvince)}`,
                state: `${getWardName(selectedWard)}, ${getDistrictName(selectedDistrict)}, ${getProvinceName(selectedProvince)}`,
                postcode: "",
                country: "VN"
            },
            line_items: products.map((product) => ({
                product_id: product.id ?? product.product?.id,
                quantity: product.quantity
            })),
            total: totalPayment
        };

        try {
            const response = await Order.create(orderData);
            console.log("Đơn hàng đã tạo:", response.data);
            navigate("/payment/order-success", { state: { order: response.data } });
        } catch (error) {
            toast.error('Có lỗi xảy ra vui lòng thử lại!')
            console.error("Lỗi khi tạo đơn hàng:", error.response?.data || error);
        }
    }

    return (
        <div className="my-12 w-full">
            <div className="grid grid-cols-3 gap-12">
                {/* Danh sách sản phẩm */}
                <div className="col-span-2 text-start">
                    <div className="mb-8 bg-gray-200/20 rounded-lg py-3 px-5">
                        <h2 className="text-2xl font-medium mb-6">
                            Sản phẩm trong đơn &#40; {products.length} &#41;
                        </h2>
                        {products.map((item, index) => (
                            <div key={index} className="flex gap-3 items-center border-b py-2">
                                <div className="w-20">
                                    <img
                                        src={item.product?.images?.[0]?.src ?? item.images?.[0]?.src ?? "/default-image.jpg"}
                                        alt={item.product?.name ?? item.name ?? "Sản phẩm"}
                                    />
                                </div>
                                <div className="py-2">
                                    <p className="flex gap-3">
                                        <span className="font-medium text-xl">{item.product?.name ?? item.name}</span>
                                    </p>
                                    <p className="flex gap-3">
                                        <strong>Giá: </strong>
                                        <span className="text-destructive">{formatVND(item.product?.price ?? item.price)}</span>
                                    </p>
                                    <p className="flex gap-3">
                                        <strong>Số lượng: </strong>
                                        <span className="text-destructive">{item.quantity}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Form thông tin khách hàng */}
                    <div className="bg-gray-200/20 rounded-lg py-3 px-5">
                        <h2 className="text-2xl font-medium">Thông tin người nhận</h2>
                        <div className="my-6">
                            <Form {...form}>
                                <form id="payment-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    {/* Họ tên */}
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Họ Tên</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nhập họ tên..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {/* Email */}
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Địa chỉ Email..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {/* Số điện thoại */}
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Số điện thoại</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Điện thoại..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {/* Tỉnh */}
                                    <FormItem>
                                        <FormLabel>Tỉnh</FormLabel>
                                        <Select onValueChange={(value) => setSelectedProvince(value)}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Chọn tỉnh" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {provinces.map((province) => (
                                                    <SelectItem value={String(province.code)} key={province.code}>{province.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>

                                    {/* Quận/Huyện */}
                                    <FormItem>
                                        <FormLabel>Quận/Huyện</FormLabel>
                                        <Select onValueChange={(value) => setSelectedDistrict(value)} disabled={!selectedProvince}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Chọn quận/huyện" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {districts.map((district) => (
                                                    <SelectItem key={district.code} value={String(district.code)}>
                                                        {district.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>

                                    {/* Phường/Xã */}
                                    <FormItem>
                                        <FormLabel>Phường/Xã</FormLabel>
                                        <Select onValueChange={(value) => setSelectedWard(value)} disabled={!selectedDistrict}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Chọn phường/xã" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {wards.map((ward) => (
                                                    <SelectItem key={ward.code} value={String(ward.code)}>
                                                        {ward.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                    {/* Địa chỉ */}
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Địa chỉ</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Địa chỉ..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {/* Ghi chú */}
                                    <FormField
                                        control={form.control}
                                        name="note"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ghi chú</FormLabel>
                                                <FormControl>
                                                    <Textarea className="h-28" placeholder="Nội dung..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>

                {/* Tổng kết đơn hàng */}
                <div className="col-span-1 text-start">
                    <div className="sticky right-0 top-12 bg-gray-200/20 rounded-lg py-3 px-5">
                        <h2 className="text-2xl font-medium">Thanh toán</h2>
                        <div className="border-b py-2 flex justify-between gap-6">
                            <p><strong>Tổng tiền</strong></p>
                            <span className="text-destructive">{formatVND(totalPrice)}</span>
                        </div>
                        <div className="border-b py-2 flex justify-between gap-6">
                            <p><strong>Phí vận chuyển</strong></p>
                            <span className="text-destructive">{SHIPPING > 0 ? formatVND(SHIPPING) : "Miễn phí"}</span>
                        </div>
                        <div className="border-b py-2 flex justify-between gap-6">
                            <p><strong>Cần thanh toán</strong></p>
                            <span className="text-destructive">{formatVND(totalPayment)}</span>
                        </div>
                        <Button form="payment-form" variant={"destructive"} className="my-6" type="submit">
                            Thanh toán
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;