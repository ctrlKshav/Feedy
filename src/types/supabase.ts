import { Attachment, Role } from "./chat";

export interface SupabaseThread {
    id: string;
    user_id: string;
    admin_id: string;
    title: string;
    created_at: EpochTimeStamp;
    updated_at: EpochTimeStamp
    messages: ThreadMessage[];
}

export interface ThreadMessage {
    id: string;
    thread_id: string;
    user_id: string;
    admin_id: string;
    content: string;
    attachments: Attachment[];
    role: Role;
    created_at : EpochTimeStamp
    updated_at? : EpochTimeStamp
}

export interface Profile{
    id: string;
    name: string;
    email: string;
    role: string;
    persona: string;
    created_at?: EpochTimeStamp;
}