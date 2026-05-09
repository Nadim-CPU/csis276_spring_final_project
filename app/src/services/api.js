const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/+$/, '');
const GRAPHQL_URL = `${API_BASE_URL}/graphql`;

const buildError = (payload, fallback = 'Request failed.') => {
    const firstError = payload?.errors?.[0];
    if (firstError) {
        return {
            message: firstError.message || fallback,
            code: firstError.extensions?.code || 'GRAPHQL_ERROR',
        };
    }
    return {
        message: payload?.message || fallback,
        code: payload?.code || 'REQUEST_ERROR',
    };
};

export const requestGraphql = async (document, options = {}) => {
    const { variables, includeMeta = false, dataPath } = options;

    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('accessToken');
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({ query: document, variables }),
    });

    const payload = await response.json().catch(() => ({}));
    const hasErrors = !response.ok || (Array.isArray(payload?.errors) && payload.errors.length > 0);

    if (hasErrors) {
        const error = buildError(payload);
        const isUnauthorized =
            error.code === 'UNAUTHENTICATED' ||
            error.code === 'UNAUTHORIZED' ||
            response.status === 401 ||
            error.message?.toLowerCase().includes('unauthorized');
        if (isUnauthorized && token) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        if (includeMeta) {
            return { ok: false, status: response.status, data: error };
        }
        throw new Error(error.message);
    }

    const data = dataPath ? payload?.data?.[dataPath] : payload?.data;
    if (includeMeta) {
        return { ok: true, status: response.status, data };
    }
    return data;
};
