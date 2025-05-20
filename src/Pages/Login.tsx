import LoginApi from "@/api/Login"
import { useAuth } from "@/Context/AuthContext";
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form"
import { Input } from "@/Components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"

const formSchema = z.object({
    password: z.string().min(2, {
        message: "Mật khẩu phải từ 2 ký tự.",
    }),
    username: z.string().min(2, {
        message: "Username phải đúng định dạng.",
    }),
})

const Login = () => {
    const { setAuthData } = useAuth();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            username: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        try {
            const response = await LoginApi.login(values);
            setAuthData(response.data);
            navigate("/");
        } catch (error) {
            console.error("Login thất bại:", error);
            // Kiểm tra nếu lỗi là yêu cầu xác minh email
            if (error.response?.data?.code === "[jwt_auth] uv_authentication_failed") {
                const verifyLinkRegex = /href="([^"]+)"/;
                const match = error.response.data.message.match(verifyLinkRegex);
                const verifyLink = match ? match[1] : null;

                if (verifyLink) {
                    navigate(`/verify-email?verifyLink=${encodeURIComponent(verifyLink)}`);
                } else {
                    navigate("/verify-email");
                }
            }
        }
    }

    return (
        <div className="w-full shadow-2xl py-12">
            <h2 className="text-2xl font-bold">Đăng nhập</h2>
            <span>Chào mừng bạn tới Book Store</span>
            <div className="flex justify-center mt-12">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 min-w-96">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nhập username..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mật khẩu</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Nhập mật khẩu..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="text-start">
                            <div>
                                <Link to={''}>Quên mật khẩu!</Link>
                            </div>
                            <div>
                                <span>Bạn chưa có tài khoản? </span>
                                <Link to={'/register'} className="text-destructive">Đăng ký</Link>
                            </div>
                        </div>
                        <Button className='border text-white dark:bg-white dark:text-black' type="submit">Đăng nhập</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default Login