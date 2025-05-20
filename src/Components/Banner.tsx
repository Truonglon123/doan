import { Swiper, SwiperSlide } from "swiper/react"

import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import BannerApi from "@/api/Banner";

const Banner = () => {
    const [BannerImgs, setBannerImg] = useState([])

    useEffect(() => {
        const fetchBanners = async () => {
          try {
            const response = await BannerApi.getBanner()
            setBannerImg(response.data)
          } catch (error) {
            console.error("Lỗi khi gọi API category: ", error)
          }
        }
        fetchBanners()
      }, [])

    return (
        <div className="grid grid-cols-3 gap-6 my-12">
            <Swiper
                navigation={true}
                modules={[Navigation]}
                className="rounded-2xl col-span-2"
            >
                {BannerImgs.banner_left?.map((bannerImg, index) => (
                    <SwiperSlide key={index}>
                        <Link to={bannerImg.link}>
                            <img src={bannerImg.img} alt={bannerImg.img} className="h-full object-cover" />
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="grid grid-rows-2 justify-between gap-6">
                <div className="h-full w-full">
                    <img src={BannerImgs.banner_right_top} alt={BannerImgs.banner_right_top} className="rounded-2xl object-cover" />
                </div>
                <div className="h-full w-full">
                    <img src={BannerImgs.banner_right_bottom} alt={BannerImgs.banner_right_bottom} className="rounded-2xl object-cover" />
                </div>
            </div>
        </div>
    )
}

export default Banner