import axios from 'axios';

const API_URL = 'https://api.labarcaministerio.com/api';

export interface Category {
    id: number;
    name: string;
    slug: string;
}

export interface CategoryData {
    name: string;
}

export const getCategories = async (): Promise<Category[]> => {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data;
};

export const createCategory = async (categoryData: CategoryData, token: string): Promise<Category> => {
    const response = await axios.post(`${API_URL}/categories`, categoryData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const updateCategory = async (id: number, categoryData: CategoryData, token: string): Promise<Category> => {
    const response = await axios.put(`${API_URL}/categories/${id}`, categoryData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const deleteCategory = async (id: number, token: string): Promise<void> => {
    await axios.delete(`${API_URL}/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};