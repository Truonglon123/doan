import Banner from "@/Components/Banner"
import OldBook from "@/Sections/OldBook"
import Partner from "@/Sections/Partner"
import ProductHot from "@/Sections/ProductHot"

const Home = () => {
  return (
    <div className="w-full">
      <Banner />
      <ProductHot />
      <OldBook />
      <Partner />
    </div>
  )
}

export default Home