export async function fetchProvinces() {
    const response = await fetch("https://provinces.open-api.vn/api/p/");
    return response.json();
}

export async function fetchDistricts(provinceCode: string) {
    const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
    const data = await response.json();
    return data.districts;
}

export async function fetchWards(districtCode: string) {
    const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
    const data = await response.json();
    return data.wards;
}
