export interface ReflectionRating {
    indicator: string;
    rating: "Basic" | "Developing" | "Effective" | "Highly Effective";
}

export interface ReflectionSection {
    id: string;
    title: string;
    ratings: ReflectionRating[];
    evidence: string;
}

export interface DetailedReflection {
    teacherName: string;
    teacherEmail: string;
    submissionDate: string;
    sections: {
        planning: ReflectionSection; // Section A
        classroomEnvironment: ReflectionSection; // Section B1
        instruction: ReflectionSection; // Section B2
        assessment: ReflectionSection; // Section B3
        environment: ReflectionSection; // Section B4
        professionalism: ReflectionSection; // Section C
    };
    strengths: string;
    improvements: string;
    goal: string;
    comments?: string;
}

export interface Observation {
    id: string;
    teacher?: string; // Optional for leader dashboard view context
    date: string;
    observerName?: string;
    observerRole?: string;
    domain: string;
    score: number;
    notes?: string;
    hasReflection: boolean;
    reflection?: string; // Legacy simple string
    detailedReflection?: DetailedReflection; // New structured data
    // Extended fields for full reporting
    learningArea?: string;
    strengths?: string;
    improvements?: string;
    teachingStrategies?: string[];
    // Extended fields for full reporting
    classroom?: {
        block: string;
        grade: string;
        section: string;
        learningArea: string;
    };
}
