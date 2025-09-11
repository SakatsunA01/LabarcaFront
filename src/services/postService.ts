import axios from 'axios';
import type { Category } from './categoryService';

const API_URL = 'https://api.labarcaministerio.com';

export interface Post {
    id: number;
    titulo: string;
    contenido: string;
    url_imagen?: string;
    autor?: string;
    fecha_publicacion: string; // La fecha se manejará como string
    created_at: string;
    updated_at: string;
    categories?: Category[];
    likes_count?: number;
    is_liked?: boolean;
    comments?: Comment[];
}

export interface PostData {
    titulo: string;
    contenido: string;
    autor?: string;
    imagen_file?: File | null;
    fecha_publicacion?: string | null;
    categories?: number[];
}

export interface Comment {
    id: number;
    user_id: number;
    post_id: number;
    body: string;
    created_at: string;
    updated_at: string;
    user: { // User relationship eager loaded
        id: number;
        name: string;
    };
}

// --- Funciones del Servicio ---

/**
 * Obtiene todos los posts publicados.
 */
export const getPosts = async (): Promise<Post[]> => {
    const response = await axios.get(`${API_URL}/posts`);
    return response.data;
};

/**
 * Obtiene los últimos posts publicados.
 */
export const getLatestPosts = async (): Promise<Post[]> => {
    const response = await axios.get(`${API_URL}/posts/latest`);
    return response.data;
};

/**
 * Obtiene un post por su ID.
 */
export const getPost = async (id: number | string): Promise<Post> => {
    const response = await axios.get(`${API_URL}/posts/${id}`);
    return response.data;
};

/**
 * Crea un nuevo post.
 * Requiere autenticación.
 */
export const createPost = async (postData: PostData, token: string): Promise<Post> => {
    const formData = new FormData();
    formData.append('titulo', postData.titulo);
    formData.append('contenido', postData.contenido);

    if (postData.autor) {
        formData.append('autor', postData.autor);
    }
    if (postData.imagen_file) {
        formData.append('imagen_file', postData.imagen_file);
    }
    if (postData.fecha_publicacion) {
        formData.append('fecha_publicacion', postData.fecha_publicacion);
    }
    if (postData.categories) {
        postData.categories.forEach((catId, index) => {
            formData.append(`categories[${index}]`, catId.toString());
        });
    }

    const response = await axios.post(`${API_URL}/posts`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    return response.data;
};

/**
 * Actualiza un post existente.
 * Requiere autenticación.
 */
export const updatePost = async (id: number | string, postData: Partial<PostData>, token: string): Promise<Post> => {
    const formData = new FormData();
    // Usamos _method: 'PUT' porque HTML forms no soportan PUT en multipart/form-data
    formData.append('_method', 'PUT');

    if (postData.titulo) {
        formData.append('titulo', postData.titulo);
    }
    if (postData.contenido) {
        formData.append('contenido', postData.contenido);
    }
    if (postData.autor) {
        formData.append('autor', postData.autor);
    }
    if (postData.imagen_file) {
        formData.append('imagen_file', postData.imagen_file);
    }
    if (postData.fecha_publicacion) {
        formData.append('fecha_publicacion', postData.fecha_publicacion);
    }
    if (postData.categories) {
        postData.categories.forEach((catId, index) => {
            formData.append(`categories[${index}]`, catId.toString());
        });
    }

    const response = await axios.post(`${API_URL}/posts/${id}`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });

    return response.data;
};

/**
 * Elimina un post.
 * Requiere autenticación.
 */
export const deletePost = async (id: number | string, token: string): Promise<void> => {
    await axios.delete(`${API_URL}/posts/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
};

/**
 * Likes a post.
 */
export const likePost = async (postId: number | string, token: string): Promise<void> => {
    await axios.post(`${API_URL}/posts/${postId}/like`, {},
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
};

/**
 * Unlikes a post.
 */
export const unlikePost = async (postId: number | string, token: string): Promise<void> => {
    await axios.delete(`${API_URL}/posts/${postId}/like`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

/**
 * Adds a comment to a post.
 */
export const addComment = async (postId: number | string, body: string, token: string): Promise<Comment> => {
    const response = await axios.post(`${API_URL}/posts/${postId}/comments`, { body }, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    return response.data;
};

/**
 * Deletes a comment.
 */
export const deleteComment = async (commentId: number | string, token: string): Promise<void> => {
    await axios.delete(`${API_URL}/comments/${commentId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
};
