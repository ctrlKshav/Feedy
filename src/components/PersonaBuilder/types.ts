export interface PersonaPreferences {
    design: string[];
    colors: string;
    imagePreference: string;
    tone: number;
    customNotes: string;
  }
  
  export interface PersonaBuilderProps {
    initialData?: Partial<PersonaPreferences>;
    onComplete: (prompt: string) => void;
  }
  
  export interface StepProps {
    preferences: PersonaPreferences;
    onChange: (key: keyof PersonaPreferences, value: any) => void;
  }