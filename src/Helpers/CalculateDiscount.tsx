export const CalculateDiscount = (originalPrice: number, salePrice: number): number => {
    if (!salePrice || originalPrice <= salePrice) {
        return 0
    }
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}