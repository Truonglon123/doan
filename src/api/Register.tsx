import apiClient from ".";

const RegisterApi = {
    register: (data: { username: string; password: string; email: string }) => apiClient.post("custom/v1/register", data),
};

export default RegisterApi;
