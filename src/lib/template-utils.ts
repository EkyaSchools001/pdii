import { FormField } from "@/pages/admin/FormTemplatesView";

export interface FormTemplate {
    id: number;
    title: string;
    type: "Observation" | "Reflection" | "Goal Setting" | "Other";
    version: string;
    status: string;
    lastUpdated: string;
    questions: number;
    targetRole: string;
    targetBlock: string;
    fields: FormField[];
}

export const getTemplates = (): FormTemplate[] => {
    const saved = localStorage.getItem("form_templates");
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse form templates", e);
        }
    }
    return [];
};

export const getActiveTemplateByType = (type: FormTemplate["type"], titleSearch?: string): FormTemplate | null => {
    const templates = getTemplates();
    const filtered = templates.filter(t => t.status === "Active" && t.type === type);

    if (titleSearch) {
        const found = filtered.find(t => t.title.toLowerCase().includes(titleSearch.toLowerCase()));
        if (found) return found;
    }

    return filtered.length > 0 ? filtered[0] : null;
};
