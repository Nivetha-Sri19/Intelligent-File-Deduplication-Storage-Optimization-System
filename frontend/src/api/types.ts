export type User={id:string;email:string;role:'user'|'admin';is_active:boolean};
export type FileItem={id:string;original_filename:string;mime_type:string;extension:string;size_bytes:number;status:'pending'|'processing'|'ready'|'failed'|'deleted';is_protected:boolean;uploaded_at:string;deleted_at?:string|null};
export type DuplicateGroup={group_hash:string;files:{file_id:string;filename:string;size_bytes:number;uploaded_at:string;is_original:boolean}[];storage_consumed_bytes:number;potential_savings_bytes:number};
export type Dashboard={total_files:number;total_storage_bytes:number;duplicate_files:number;duplicate_storage_bytes:number;potential_storage_savings_bytes:number;largest_files:any[];recent_uploads:any[]};
export type DeletionHistory={id:string;file_id:string;user_id:string;filename:string;size_bytes:number;status:'requested'|'completed'|'failed';reason?:string|null;deleted_at?:string|null;created_at:string};
export type DeletionPreview={file_id:string;filename:string;size_bytes:number;potential_storage_savings_bytes:number;protected:boolean};
