import formatVND from "@/Helpers/FormatVND";
import { useLocation, Link } from "react-router-dom";

function OrderSuccess() {
    const location = useLocation();
    const order = location.state?.order; // Lấy dữ liệu đơn hàng
    
    if (!order) {
        return <p>Không tìm thấy đơn hàng.</p>;
    }

    return (
        <div className="text-start shadow-lg p-8 rounded-lg">
            <h2 className="text-center text-2xl font-bold">🎉 Đặt hàng thành công!</h2>
            <div className="my-6">
                <p>Mã đơn hàng: <strong>DH-{order.id}</strong></p>
                <p>Tổng tiền: <strong>{formatVND(order.total)}</strong></p>
                <p>Hình thức thanh toán: <strong>{order.payment_method === 'cod' ? 'Khi nhận hàng' : ''}</strong></p>
                <p>Khách hàng: <strong>{order.billing.last_name}</strong></p>
                <p>Địa chỉ nhận hàng: <strong>{order.shipping.address_1}, {order.shipping.city}</strong></p>
            </div>
            <div className="mb-10 text-center">
                <strong>Cảm ơn quý khách đã luôn tin tưởng và ủng hộ.
                <p className="text-destructive">Vui lòng liên hệ chúng tôi nếu có thay đổi.</p></strong>
            </div>
            <div className="text-center">
                <Link to="/" className="border p-3 rounded-lg">Quay về trang chủ</Link>
            </div>
        </div>
    );
}

export default OrderSuccess;
