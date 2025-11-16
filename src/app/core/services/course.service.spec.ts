import { CourseService } from './course.service';

describe('CourseService', () => {
  let service: CourseService;

  beforeEach(() => {
    service = new CourseService();
  });

  describe('Поиск курсов', () => {
    it('должен находить курс по ID', () => {
      const course = service.getCourseById(1);

      expect(course).toBeTruthy();
      expect(course?.id).toBe(1);
    });

    it('должен возвращать undefined для несуществующего ID', () => {
      const course = service.getCourseById(999);

      expect(course).toBeUndefined();
    });
  });

  describe('Работа с уроками', () => {
    it('должен находить урок по courseId и lessonId', () => {
      const result = service.getLessonById(1, 1);

      expect(result).toBeTruthy();
      expect(result?.course.id).toBe(1);
      expect(result?.lesson.id).toBe(1);
      expect(result?.lessonIndex).toBe(0);
    });

    it('должен возвращать следующий урок', () => {
      const nextLesson = service.getNextLesson(1, 1);

      expect(nextLesson).toBeTruthy();
      expect(nextLesson?.id).toBe(2);
    });

    it('должен возвращать предыдущий урок', () => {
      const prevLesson = service.getPreviousLesson(1, 2);

      expect(prevLesson).toBeTruthy();
      expect(prevLesson?.id).toBe(1);
    });

    it('должен возвращать null для последнего урока', () => {
      const course = service.getCourseById(1);
      const lastLessonId = course!.lessons[course!.lessons.length - 1].id;
      
      const nextLesson = service.getNextLesson(1, lastLessonId);

      expect(nextLesson).toBeNull();
    });
  });

  describe('Поиск и фильтрация', () => {
    it('должен находить курсы по поисковому запросу', () => {
      const results = service.searchCourses('Angular');

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].title.en).toContain('Angular');
    });

    it('должен фильтровать курсы по сложности', () => {
      const beginnerCourses = service.getCoursesByDifficulty('beginner');

      expect(beginnerCourses.length).toBeGreaterThan(0);
      beginnerCourses.forEach(course => {
        expect(course.difficulty).toBe('beginner');
      });
    });

    it('должен фильтровать курсы по автору', () => {
      const authorCourses = service.getCoursesByAuthor('James');

      expect(authorCourses.length).toBeGreaterThan(0);
      authorCourses.forEach(course => {
        expect(course.author).toContain('James');
      });
    });
  });

  describe('Локализация', () => {
    it('должен возвращать локализованный курс на английском', () => {
      const localized = service.getLocalizedCourse(1, 'en');

      expect(localized).toBeTruthy();
      expect(localized?.title).toBe('Introduction to Angular');
    });

    it('должен возвращать локализованный курс на русском', () => {
      const localized = service.getLocalizedCourse(1, 'ru');

      expect(localized).toBeTruthy();
      expect(localized?.title).toBe('Введение в Angular');
    });

    it('должен возвращать уникальные категории', () => {
      const categories = service.getCategories('en');

      expect(categories.length).toBeGreaterThan(0);
      const uniqueCategories = [...new Set(categories)];
      expect(categories.length).toBe(uniqueCategories.length);
    });
  });

  describe('Добавление курсов', () => {
    it('должен добавлять новый курс', () => {
      const initialCount = service.courses().length;
      const newCourse = {
        title: { en: 'New Course', ru: 'Новый курс' },
        category: { en: 'Test', ru: 'Тест' },
        rating: 4.0,
        author: 'Test Author',
        description: { en: 'Description', ru: 'Описание' },
        objectives: [{ en: 'Objective', ru: 'Цель' }],
        program: [{ en: 'Program', ru: 'Программа' }],
        difficulty: 'beginner' as const,
        lessons: [{
          id: 1,
          title: { en: 'Lesson', ru: 'Урок' },
          description: { en: 'Desc', ru: 'Описание' },
          videoUrl: 'https://example.com/video.mp4',
          duration: '10:00',
          order: 1
        }]
      };

      service.addCourse(newCourse);

      expect(service.courses().length).toBe(initialCount + 1);
      expect(service.courses()[initialCount].title.en).toBe('New Course');
    });
  });

  describe('Валидация', () => {
    it('должен проверять валидность курса', () => {
      const validCourse = {
        title: { en: 'Title', ru: 'Заголовок' },
        category: { en: 'Category', ru: 'Категория' },
        rating: 4.0,
        author: 'Author',
        description: { en: 'Description', ru: 'Описание' },
        objectives: [{ en: 'Objective', ru: 'Цель' }],
        program: [{ en: 'Program', ru: 'Программа' }],
        difficulty: 'beginner' as const,
        lessons: [{
          id: 1,
          title: { en: 'Lesson', ru: 'Урок' },
          description: { en: 'Desc', ru: 'Описание' },
          videoUrl: 'https://example.com/video.mp4',
          duration: '10:00',
          order: 1
        }]
      };

      const isValid = service.isValidCourse(validCourse);

      expect(isValid).toBe(true);
    });
  });

  describe('Статистика', () => {
    it('должен возвращать количество курсов', () => {
      const count = service.getCoursesCount();

      expect(count).toBe(service.courses().length);
    });

    it('должен возвращать общее количество уроков', () => {
      const totalLessons = service.getTotalLessonsCount();

      expect(totalLessons).toBeGreaterThan(0);
    });

    it('должен возвращать популярные курсы', () => {
      const featured = service.getFeaturedCourses();

      expect(featured.length).toBeGreaterThan(0);
      featured.forEach(course => {
        expect(course.rating).toBeGreaterThanOrEqual(4.0);
      });
    });
  });
});