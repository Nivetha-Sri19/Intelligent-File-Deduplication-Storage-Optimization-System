import {api} from './client'; import type {Dashboard,DeletionHistory,DeletionPreview,DuplicateGroup,FileItem,User} from './types';
export const auth={login:(email:string,password:string)=>api.post('/auth/login',{email,password}),register:(email:string,password:string)=>api.post('/auth/register',{email,password}),me:()=>api.get<User>('/auth/me')};
export const files={list:(params:any)=>api.get('/files',{params}),upload:(f:File)=>{const d=new FormData();d.append('file',f);return api.post('/files/upload',d,{headers:{'Content-Type':'multipart/form-data'}})},get:(id:string)=>api.get<FileItem>(`/files/${id}`),metadata:(id:string)=>api.get(`/files/${id}/metadata`),download:(id:string)=>api.get(`/files/${id}/download`,{responseType:'blob'}),removePreview:(id:string)=>api.get<DeletionPreview>(`/deletions/${id}/preview`),remove:(id:string)=>api.delete(`/deletions/${id}`)};
export const duplicates={list:()=>api.get<DuplicateGroup[]>('/duplicates')};
export const analytics={dashboard:()=>api.get<Dashboard>('/analytics/dashboard')};
export const deletions={history:()=>api.get<DeletionHistory[]>('/deletions/history')};
