import axios from 'axios';

const API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/audiobooks`;

interface DashboardStats {
    totalBooks: number;
    totalMinutesListened: number;
    minutesRemaining: number;
    notStarted: number;
}

interface Book {
    id: number;
    title: string;
    author: string;
    description: string;
    coverPath?: string;
    duration: string;
    currentTime: string;
    chapters: any[];
}

interface Bookmark {
    id: number;
    timestamp: string;
    note: string;
    createdAt: string;
}

interface UserSettings {
    skipInterval: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
    const response = await axios.get(`${API_URL}/dashboard`);
    return response.data;
};

export const getAudiobooks = async (): Promise<Book[]> => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getAudiobook = async (id: number | string): Promise<Book> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const uploadAudiobook = async (file: File, onUploadProgress?: (progressEvent: any) => void): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
    });
    return response.data;
};

export const updateProgress = async (id: number | string, currentTime: string): Promise<void> => {
    await axios.put(`${API_URL}/${id}/progress`, JSON.stringify(currentTime), {
        headers: { 'Content-Type': 'application/json' }
    });
};

export const updateAudiobook = async (id: number | string, data: Partial<Book>): Promise<void> => {
    await axios.put(`${API_URL}/${id}`, data);
};

export const deleteAudiobook = async (id: number | string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};

export const addBookmark = async (id: number | string, bookmark: { timestamp: string; note: string }): Promise<Bookmark> => {
    const response = await axios.post(`${API_URL}/${id}/bookmarks`, bookmark);
    return response.data;
};

export const getBookmarks = async (id: number | string): Promise<Bookmark[]> => {
    const response = await axios.get(`${API_URL}/${id}/bookmarks`);
    return response.data;
};

export const deleteBookmark = async (id: number | string, bookmarkId: number): Promise<void> => {
    await axios.delete(`${API_URL}/${id}/bookmarks/${bookmarkId}`);
};

const USERS_API_URL = `${process.env.REACT_APP_BACKEND_URL}/api/users`;

export const getUserSettings = async (userId: number = 1): Promise<UserSettings> => {
    const response = await axios.get(`${USERS_API_URL}/${userId}/settings`);
    return response.data;
};

export const updateUserSettings = async (userId: number = 1, settings: Partial<UserSettings>): Promise<void> => {
    await axios.put(`${USERS_API_URL}/${userId}/settings`, settings);
};