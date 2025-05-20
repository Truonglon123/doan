import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form"
import { Input } from "@/Components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Textarea } from "@/Components/ui/textarea"
import { Mail, MapPinCheckInside, PhoneCall } from "lucide-react"

const formSchema = z.object({
    username: z.string().min(2, {
        message: "Tên người dùng quá ngắn.",
    }),
    email: z.string().email({
        message: "Email không đúng định dạng.",
    }),
    phone: z.string().regex(/^0\d{9}$/, {
        message: "Số điện thoại không hợp lệ.",
    })
        .optional(),
    description: z.string(),
})

const Contact = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            phone: "",
            description: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }
    return (
        <div className="w-full my-12">
            <h3 className="text-3xl font-medium">Liên Hệ Với Chúng Tôi</h3>
            <div className="grid grid-cols-2 gap-6 items-center mt-12">
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nội dung</FormLabel>
                                        <FormControl>
                                            <Textarea className="h-28" placeholder="Nội dung..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button variant='outline' type="submit">Gửi</Button>
                        </form>
                    </Form>
                </div>
                <div className="grid grid-cols-3 items-center justify-center">
                    <div className="flex flex-col gap-3 justify-center items-center">
                        <span className="font-medium text-lg">Địa chỉ</span>
                        <MapPinCheckInside />
                        <span>Địa chỉ cửa hàng, văn phòng</span>
                    </div>
                    <div className="flex flex-col gap-3 justify-center items-center">
                        <span className="font-medium text-lg">Điện thoại</span>
                        <PhoneCall />
                        <span>0123456789</span>
                    </div>
                    <div className="flex flex-col gap-3 justify-center items-center">
                        <span className="font-medium text-lg">Email</span>
                        <Mail />
                        <span>example@gmail.com</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact