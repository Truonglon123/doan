import apiClient from ".";

const CategoryApi = {
    category: () => apiClient.get("wc/v2/products/categories"),
    getIdBySlug: (slug: string) => apiClient.get("wc/v2/products/categories", {
        params: {
            slug: slug
        }
    })
};

export default CategoryApi;
