import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const NotFound = () => {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-9xl">404</h1>
            <span className="text-2xl">Trang bạn tìm kiếm hiện không tồn tại.</span>
            <div>
                <Link to={'/'}><Button>Về trang chủ</Button></Link>
            </div>
        </div>
    )
}

export default NotFound