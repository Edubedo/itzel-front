const getApiBaseUrl = () => {
    // En desarrollo usar localhost, en producción usar la URL de Railway
    const isDevelopment = import.meta.env.MODE === 'development';
    return isDevelopment ? 'http://localhost:3001' : 'https://gespo-backend.up.railway.app';
};


export { getApiBaseUrl };