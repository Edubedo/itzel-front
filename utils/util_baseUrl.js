const getApiBaseUrl = () => {
    // En desarrollo usar localhost, en producción usar la URL de Railway
    const isDevelopment = import.meta.env.MODE === 'development';
    return isDevelopment ? 'http://localhost:3001' : 'https://itzel-back-production.up.railway.app';
};

const getApiBaseUrlWithApi = () => {
    // Retorna la URL con /api incluido
    return `${getApiBaseUrl()}/api`;
};

export { getApiBaseUrl, getApiBaseUrlWithApi };