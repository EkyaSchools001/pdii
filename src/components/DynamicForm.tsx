import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormField } from "@/pages/admin/FormTemplatesView";

interface DynamicFormProps {
    fields: FormField[];
    onSubmit: (data: Record<string, any>) => void;
    onCancel?: () => void;
    submitLabel?: string;
}

export function DynamicForm({ fields, onSubmit, onCancel, submitLabel = "Submit" }: DynamicFormProps) {
    const [formData, setFormData] = useState<Record<string, any>>({});

    const handleInputChange = (id: string, value: any) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simple validation
        const missing = fields.filter(f => f.required && !formData[f.id]);
        if (missing.length > 0) {
            alert(`Please fill in required fields: ${missing.map(f => f.label).join(", ")}`);
            return;
        }
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6">
                {fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                        <Label htmlFor={field.id} className="text-sm font-semibold">
                            {field.label} {field.required && <span className="text-destructive">*</span>}
                        </Label>

                        {field.type === "text" && (
                            <Input
                                id={field.id}
                                value={formData[field.id] || ""}
                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                                placeholder={`Enter ${field.label.toLowerCase()}...`}
                            />
                        )}

                        {field.type === "textarea" && (
                            <Textarea
                                id={field.id}
                                value={formData[field.id] || ""}
                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                                placeholder={`Enter ${field.label.toLowerCase()}...`}
                                className="min-h-[100px]"
                            />
                        )}

                        {(field.type === "date" || field.type === "time") && (
                            <Input
                                id={field.id}
                                type={field.type}
                                value={formData[field.id] || ""}
                                onChange={(e) => handleInputChange(field.id, e.target.value)}
                            />
                        )}

                        {field.type === "select" && (
                            <Select
                                value={formData[field.id] || ""}
                                onValueChange={(val) => handleInputChange(field.id, val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={`Select ${field.label.toLowerCase()}...`} />
                                </SelectTrigger>
                                <SelectContent>
                                    {field.options?.map((opt) => (
                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}

                        {field.type === "radio" && (
                            <RadioGroup
                                value={formData[field.id] || ""}
                                onValueChange={(val) => handleInputChange(field.id, val)}
                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                            >
                                {field.options?.map((opt) => (
                                    <div key={opt} className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                                        <RadioGroupItem value={opt} id={`${field.id}-${opt}`} />
                                        <Label htmlFor={`${field.id}-${opt}`} className="cursor-pointer flex-1">{opt}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        )}

                        {field.type === "rating" && (
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Button
                                        key={star}
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className={cn(
                                            "h-10 w-10 p-0",
                                            (formData[field.id] || 0) >= star ? "text-primary" : "text-muted-foreground"
                                        )}
                                        onClick={() => handleInputChange(field.id, star)}
                                    >
                                        <Star className={cn("h-6 w-6", (formData[field.id] || 0) >= star && "fill-current")} />
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                {onCancel && (
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
                <Button type="submit">
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}
