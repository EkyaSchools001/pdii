import { supabase } from "@/integrations/supabase/client";

export type DocumentStatus = 'PENDING' | 'VIEWED' | 'ACKNOWLEDGED' | 'SIGNED';

export interface Document {
    id: string;
    title: string;
    file_path: string;
    requires_signature: boolean;
    hash: string;
    created_at: string;
}

export interface DocumentAcknowledgement {
    id: string;
    document_id: string;
    teacher_id: string;
    status: DocumentStatus;
    viewed_at?: string;
    acknowledged_at?: string;
    ip_address?: string;
    document_hash?: string;
    created_at: string; // Added this
    document?: Document;
}

export const documentService = {
    async getTeacherAcknowledgements(teacherId: string) {
        const { data, error } = await (supabase as any)
            .from('document_acknowledgements')
            .select(`
        *,
        document:documents(*)
      `)
            .eq('teacher_id', teacherId);

        if (error) throw error;
        return data as DocumentAcknowledgement[];
    },

    async markAsViewed(acknowledgementId: string) {
        const { error } = await (supabase as any)
            .from('document_acknowledgements')
            .update({
                status: 'VIEWED',
                viewed_at: new Date().toISOString()
            })
            .eq('id', acknowledgementId)
            .in('status', ['PENDING']);

        if (error) throw error;
    },

    async acknowledgeDocument(acknowledgementId: string, documentHash: string) {
        // In a real app, we might get the IP from a edge function or server-side hook.
        // For now, we'll try to get it via a public API if possible, or just skip it.
        let ipAddress = 'unknown';
        try {
            const res = await fetch('https://api.ipify.org?format=json');
            const data = await res.json();
            ipAddress = data.ip;
        } catch (e) {
            console.warn("Could not fetch IP address", e);
        }

        const { error } = await (supabase as any)
            .from('document_acknowledgements')
            .update({
                status: 'ACKNOWLEDGED',
                acknowledged_at: new Date().toISOString(),
                ip_address: ipAddress,
                document_hash: documentHash
            })
            .eq('id', acknowledgementId);

        if (error) throw error;
    },

    async getDocumentPublicUrl(filePath: string) {
        const { data } = supabase.storage
            .from('documents')
            .getPublicUrl(filePath);

        return data.publicUrl;
    }
};
