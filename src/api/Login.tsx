import apiClient from ".";

const LoginApi = {
    login: (data: { username: string; password: string }) => apiClient.post("jwt-auth/v1/token", data),
};

export default LoginApi;
