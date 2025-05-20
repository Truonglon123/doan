import apiClient from ".";

const ProductApi = {
    product: () => apiClient.get("wc/v2/products"),
    productDetai: (slug: string) => apiClient.get("wc/v2/products", {
        params: {
            slug: slug
        }
    }),
    getProductByCategory: (id: number, minPrice: number, maxPrice: number) => apiClient.get("wc/v2/products", {
        params: {
            category: id,
            min_price: minPrice,
            max_price: maxPrice
        }
    }),
    searchProduct: (keyword: string) => apiClient.get(`wc/v2/products?search=${keyword}`),
};

export default ProductApi;
