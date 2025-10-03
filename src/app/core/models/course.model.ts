export type Language = 'en' | 'ru';

export interface LocalizedString {
  en: string;
  ru: string;
}

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Lesson {
  id: number;
  title: LocalizedString;
  description: LocalizedString;
  videoUrl: string;
  duration: string;
  order: number;
}

export interface Course {
  id: number;
  title: LocalizedString;
  category: LocalizedString;
  rating: number;
  author: string;
  description: LocalizedString;
  objectives: LocalizedString[];
  program: LocalizedString[];
  difficulty: Difficulty;
  lessons: Lesson[];
}

export class CourseModel implements Course {
  constructor(
    public id: number,
    public title: LocalizedString,
    public category: LocalizedString,
    public rating: number,
    public author: string,
    public description: LocalizedString,
    public objectives: LocalizedString[],
    public program: LocalizedString[],
    public difficulty: Difficulty,
    public lessons: Lesson[]
  ) {}

  getLocalizedValue(value: LocalizedString, lang: Language): string {
    return value[lang];
  }

  getTitle(lang: Language): string {
    return this.title[lang];
  }

  getDescription(lang: Language): string {
    return this.description[lang];
  }

  getCategory(lang: Language): string {
    return this.category[lang];
  }

  getObjectives(lang: Language): string[] {
    return this.objectives.map(obj => obj[lang]);
  }

  getProgram(lang: Language): string[] {
    return this.program.map(item => item[lang]);
  }
}