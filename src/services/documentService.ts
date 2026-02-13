<<<<<<< HEAD
import api from '@/lib/api';

=======
>>>>>>> 6a9198745ad4aeaac08f094cc2d989de31863c9a
export type DocumentStatus = 'PENDING' | 'VIEWED' | 'ACKNOWLEDGED' | 'SIGNED';

export interface Document {
    id: string;
    title: string;
<<<<<<< HEAD
    description?: string;
    fileUrl: string; // Changed from file_path to match DB
    fileName: string;
    fileSize: number;
    requiresSignature: boolean; // Changed from requires_signature
    version: string;
    hash?: string;
    createdAt: string; // Changed from created_at
    createdBy?: { fullName: string };
    assignedTo?: number; // Count for UI
    acknowledged?: number; // Count for UI
    pending?: number; // Count for UI
    status?: string; // 'Active' | 'Draft'
=======
    file_path: string;
    requires_signature: boolean;
    hash: string;
    created_at: string;
>>>>>>> 6a9198745ad4aeaac08f094cc2d989de31863c9a
}

export interface DocumentAcknowledgement {
    id: string;
<<<<<<< HEAD
    documentId: string; // Changed from document_id
    teacherId: string; // Changed from teacher_id
    status: DocumentStatus;
    viewedAt?: string; // Changed from viewed_at
    acknowledgedAt?: string; // Changed from acknowledged_at
    ipAddress?: string; // Changed from ip_address
    documentHash?: string; // Changed from document_hash
    createdAt: string; // Changed from created_at
    document?: Document;
    teacher?: { fullName: string; email: string };
}

export const documentService = {
    // Admin: Get all documents
    async getAllDocuments() {
        try {
            const response = await api.get('/documents');
            const docs = response.data.data.documents;

            // Transform data to match UI expectations if needed
            // The backend returns documents with included acknowledgements
            // We can calculate stats here
            return docs.map((doc: any) => ({
                ...doc,
                assignedTo: doc.acknowledgements ? doc.acknowledgements.length : 0,
                acknowledged: doc.acknowledgements ? doc.acknowledgements.filter((a: any) => a.status === 'ACKNOWLEDGED' || a.status === 'SIGNED').length : 0,
                pending: doc.acknowledgements ? doc.acknowledgements.filter((a: any) => a.status === 'PENDING' || a.status === 'VIEWED').length : 0,
                status: 'Active' // Default to Active since we don't have drafting yet
            }));
        } catch (error) {
            console.error('Error fetching documents:', error);
            throw error;
        }
    },

    // Admin: Upload document
    // NOTE: This now handles the file upload as well
    async uploadDocument(data: {
        title: string;
        description: string;
        version: string;
        requiresSignature: boolean;
        file: File;
    }) {
        try {
            // 1. Upload the file first
            const formData = new FormData();
            formData.append('file', data.file);

            const uploadResponse = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const { fileUrl, fileName, fileSize } = uploadResponse.data.data;

            // 2. Create document record
            const docData = {
                title: data.title,
                description: data.description,
                version: data.version,
                requiresSignature: data.requiresSignature,
                fileUrl: fileUrl,
                fileName: fileName,
                fileSize: fileSize
            };

            const response = await api.post('/documents/upload', docData);
            return response.data.data.document;
        } catch (error) {
            console.error('Error uploading document:', error);
            throw error;
        }
    },

    // Admin: Assign document
    async assignDocument(documentId: string, teacherIds: string[]) {
        try {
            const response = await api.post('/documents/assign', {
                documentId,
                teacherIds
            });
            return response.data;
        } catch (error) {
            console.error('Error assigning document:', error);
            throw error;
        }
    },

    // Admin: Delete document
    async deleteDocument(id: string) {
        try {
            await api.delete(`/documents/${id}`);
        } catch (error) {
            console.error('Error deleting document:', error);
            throw error;
        }
    },

    // Admin: Get all acknowledgements (tracking)
    // Currently backend doesn't have a specific route for this, but we can aggregate from getAllDocuments
    // Or add a new route. For now, we'll derive it in the component or fetch if needed.

    // Teacher: Get assigned documents
    async getTeacherAcknowledgements(teacherId: string) {
        try {
            const response = await api.get('/documents/teacher/acknowledgements');
            return response.data.data.acknowledgements;
        } catch (error) {
            console.error('Error fetching teacher acknowledgements:', error);
            throw error;
        }
    },

    // Teacher: Mark as viewed
    async markAsViewed(acknowledgementId: string) {
        try {
            await api.post(`/documents/acknowledgements/${acknowledgementId}/view`);
        } catch (error) {
            console.error('Error marking as viewed:', error);
            throw error;
        }
    },

    // Teacher: Acknowledge
    async acknowledgeDocument(acknowledgementId: string, documentHash: string) {
        try {
            await api.post(`/documents/acknowledgements/${acknowledgementId}/acknowledge`, {
                hash: documentHash
            });
        } catch (error) {
            console.error('Error acknowledging document:', error);
            throw error;
=======
    document_id: string;
    teacher_id: string;
    status: DocumentStatus;
    viewed_at?: string;
    acknowledged_at?: string;
    ip_address?: string;
    document_hash?: string;
    created_at: string;
    document?: Document;
}

// Mock data for development
const mockDocuments: Document[] = [
    {
        id: "1",
        title: "Code of Conduct 2025",
        file_path: "documents/code-of-conduct.pdf",
        requires_signature: true,
        hash: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
        created_at: "2025-01-15T10:00:00Z",
    },
    {
        id: "2",
        title: "Safety Guidelines",
        file_path: "documents/safety-guidelines.pdf",
        requires_signature: false,
        hash: "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1",
        created_at: "2025-01-10T09:00:00Z",
    },
    {
        id: "3",
        title: "Data Privacy Policy",
        file_path: "documents/data-privacy.pdf",
        requires_signature: true,
        hash: "c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2",
        created_at: "2024-12-20T08:00:00Z",
    },
    {
        id: "4",
        title: "Professional Development Guidelines",
        file_path: "documents/pd-guidelines.pdf",
        requires_signature: false,
        hash: "d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3",
        created_at: "2025-02-01T11:00:00Z",
    },
];

let mockAcknowledgements: DocumentAcknowledgement[] = [
    {
        id: "ack1",
        document_id: "1",
        teacher_id: "1",
        status: "PENDING",
        created_at: "2025-01-16T10:00:00Z",
        document: mockDocuments[0],
    },
    {
        id: "ack2",
        document_id: "2",
        teacher_id: "1",
        status: "ACKNOWLEDGED",
        viewed_at: "2025-01-12T10:30:00Z",
        acknowledged_at: "2025-01-12T10:35:00Z",
        ip_address: "192.168.1.100",
        document_hash: mockDocuments[1].hash,
        created_at: "2025-01-11T09:00:00Z",
        document: mockDocuments[1],
    },
    {
        id: "ack3",
        document_id: "3",
        teacher_id: "1",
        status: "SIGNED",
        viewed_at: "2024-12-22T09:15:00Z",
        acknowledged_at: "2024-12-22T09:20:00Z",
        ip_address: "192.168.1.100",
        document_hash: mockDocuments[2].hash,
        created_at: "2024-12-21T08:00:00Z",
        document: mockDocuments[2],
    },
    {
        id: "ack4",
        document_id: "4",
        teacher_id: "1",
        status: "VIEWED",
        viewed_at: "2025-02-02T11:15:00Z",
        created_at: "2025-02-02T11:00:00Z",
        document: mockDocuments[3],
    },
];

export const documentService = {
    async getTeacherAcknowledgements(teacherId: string) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Return mock data filtered by teacher ID
        return mockAcknowledgements.filter(ack => ack.teacher_id === teacherId);
    },

    async markAsViewed(acknowledgementId: string) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // Update mock data
        const ack = mockAcknowledgements.find(a => a.id === acknowledgementId);
        if (ack && ack.status === 'PENDING') {
            ack.status = 'VIEWED';
            ack.viewed_at = new Date().toISOString();
        }
    },

    async acknowledgeDocument(acknowledgementId: string, documentHash: string) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Get IP address
        let ipAddress = 'unknown';
        try {
            const res = await fetch('https://api.ipify.org?format=json');
            const data = await res.json();
            ipAddress = data.ip;
        } catch (e) {
            console.warn("Could not fetch IP address", e);
            ipAddress = '127.0.0.1'; // Fallback
        }

        // Update mock data
        const ack = mockAcknowledgements.find(a => a.id === acknowledgementId);
        if (ack) {
            ack.status = 'ACKNOWLEDGED';
            ack.acknowledged_at = new Date().toISOString();
            ack.ip_address = ipAddress;
            ack.document_hash = documentHash;
>>>>>>> 6a9198745ad4aeaac08f094cc2d989de31863c9a
        }
    },

    async getDocumentPublicUrl(filePath: string) {
<<<<<<< HEAD
        // If it's a full URL, return it
        if (filePath.startsWith('http')) return filePath;

        // If it's a relative path starting with /uploads, prepend API URL base (or just server base)
        // Since api.ts handles base URL for API calls, we need the base URL for static files.
        // Assuming uploads are served from the same host as API
        const apiBase = api.defaults.baseURL || '';
        // Remove /api/v1 if present to get root
        const rootBase = apiBase.replace('/api/v1', '');

        return `${rootBase}${filePath}`;
    }
};

=======
        // Return a placeholder PDF URL for demo
        // In production, this would return the actual file URL
        return "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    }
};
>>>>>>> 6a9198745ad4aeaac08f094cc2d989de31863c9a
