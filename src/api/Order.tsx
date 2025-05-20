import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const WC_KEY = import.meta.env.VITE_WC_KEY!;
const WC_SECRET = import.meta.env.VITE_WC_SECRET!;

const Order = {
    create: (data: any) =>
        axios.post(`${API_URL}wc/v3/orders`, data, {
            auth: {
                username: WC_KEY,
                password: WC_SECRET,
            },
            headers: {
                "Content-Type": "application/json",
            },
        }),
};

export default Order;