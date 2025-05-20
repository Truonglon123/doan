import apiClient from "."

const BannerApi = {
    getBanner: () => apiClient.get('custom/v1/acf-options'),
}

export default BannerApi