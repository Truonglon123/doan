import { Link, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { useAuth } from "@/Context/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

const UserInfo = () => {
  const navigate = useNavigate();

  const { authData, logout } = useAuth();

  const handleLogout = () => {
    logout(); // Gọi hàm logout
    navigate("/login"); // Chuyển hướng về trang login
  };

  const handleProfile = () => {
    window.open("http://bookstore-be.test/wp-admin/profile.php", "_blank");
  }

  return (
    <>
      {authData ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{authData.user_nicename}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup title="Tính năng đang phát triển!">
              <DropdownMenuItem onClick={handleProfile} disabled>
                <User />
                <span>Profile</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div>
          <Link to={'/login'}><Button className="hover:cursor-pointer">Đăng nhập</Button></Link>
        </div>
      )}
    </>
  )
}

export default UserInfo
