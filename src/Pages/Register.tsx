import RegisterApi from "@/api/Register"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form"
import { Input } from "@/Components/ui/input"
import { useAuth } from "@/Context/AuthContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { z } from "zod"

const formSchema = z.object({
    password: z.string().min(6, {
        message: "Mật khẩu phải từ 6 ký tự.",
    }),
    email: z.string().email({
        message: "Email không đúng định dạng.",
    }),
    username: z.string().min(2, {
        message: "Tên người dùng quá ngắn."
    })
})

const Register = () => {
    const { setAuthData } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            email: "",
            username: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        setIsLoading(true);
        try {
            const response = await RegisterApi.register(values);
            toast.success('Tạo tài khoản thành công.');
            navigate("/login");
        } catch (error) {
            toast.error('Có lỗi xảy ra!')
            console.error("Đăng ký thất bại:", error);
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full shadow-2xl py-12">
            <h2 className="text-2xl font-bold">Đăng ký</h2>
            <span>Chào mừng bạn tới Book Store</span>
            <div className="flex justify-center mt-12">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 min-w-96">
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
                                <span>Bạn đã có tài khoản? </span>
                                <Link to={'/login'} className="text-destructive">Đăng nhập</Link>
                            </div>
                        </div>
                        <Button className='border text-white dark:bg-white dark:text-black' type="submit" disabled={isLoading}>{isLoading ? "Đang đăng ký..." : "Đăng ký"}</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default Register