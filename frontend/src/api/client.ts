import axios from 'axios';
export const API_BASE_URL=import.meta.env.VITE_API_BASE_URL||'http://localhost:8000/api/v1';
export const api=axios.create({baseURL:API_BASE_URL});
api.interceptors.request.use(c=>{const t=localStorage.getItem('dedup_token'); if(t)c.headers.Authorization=`Bearer ${t}`; return c;});
api.interceptors.response.use(r=>r,e=>{if(e.response?.status===401){localStorage.removeItem('dedup_token');localStorage.removeItem('dedup_user');window.location.href='/login';} return Promise.reject(e);});
