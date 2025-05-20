import { Link, useLocation } from "react-router-dom"
import UserInfo from "./UserInfo"
import { ModeToggle } from "./mode-toggle"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/Components/ui/navigation-menu"

import Cart from "./Cart"
import CategoryApi from "@/api/Category"
import { useEffect, useState } from "react"
import { ICategory } from "@/Interfaces/Category.interface"
import Search from "./Search"


const menus = [
  {
    link: '/about',
    title: "Về chúng tôi"
  },
  {
    link: '/contact',
    title: "Liên hệ"
  }
]

const Header = () => {
  const location = useLocation()
  const slug = location.pathname.split("/").pop(); // Lấy phần cuối của URL
  const [categories, setCategories] = useState<ICategory[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CategoryApi.category()
        setCategories(response.data)
      } catch (error) {
        console.error("Lỗi khi gọi API category: ", error)
      }
    }
    fetchCategories()
  }, [])

  return (
    <header className="header flex justify-between items-center w-full py-6 border-b">
      <div>
        <Link to={'/'}>
          <h1 className="text-2xl font-bold text-red-600 dark:text-white">Book Store</h1>
        </Link>
      </div>
      <div className="flex gap-6">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Danh mục</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                  {categories.map((category) => (
                    <Link to={`/category/${category.slug}`} key={category.id}
                      className={`hover:bg-accent py-2 rounded-md text-start px-3 
                        ${slug === category.slug ? "text-red-500 font-bold" : ""}`}>{category.name}</Link>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {menus.map((menu) => (
          <Link to={menu.link} key={menu.link}
            className={`hover:text-red-500 py-2 text-sm font-medium ${location.pathname === menu.link ? 'text-red-500 font-bold' : ''}`}>
            {menu.title}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-6">
        <div>
          <Search />
        </div>
        <UserInfo />
        <Cart />
        <ModeToggle />
      </div>
    </header>
  )
}

export default Header
