import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Lesson } from './lesson';
import { CourseService } from '../../core/services/course.service';
import { LanguageService } from '../../core/services/language.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslocoService, TranslocoModule } from '@jsverse/transloco';
import { of } from 'rxjs';
import { CourseModel } from '../../core/models/course.model';

// Мок данные для курса и уроков
const MOCK_COURSE = new CourseModel(
  1,
  { en: 'Angular Basics', ru: 'Основы Angular' },
  { en: 'Web Development', ru: 'Веб-разработка' },
  4.5,
  'John Doe',
  { en: 'Learn Angular fundamentals', ru: 'Изучите основы Angular' },
  [
    { en: 'Understand components', ru: 'Понять компоненты' },
    { en: 'Learn services', ru: 'Изучить сервисы' }
  ],
  [
    { en: 'Introduction', ru: 'Введение' },
    { en: 'Components', ru: 'Компоненты' }
  ],
  'beginner',
  [
    {
      id: 1,
      title: { en: 'Introduction to Angular', ru: 'Введение в Angular' },
      description: { en: 'Course overview and setup', ru: 'Обзор курса и настройка' },
      videoUrl: 'video1.mp4',
      duration: '10:00',
      order: 1
    },
    {
      id: 2,
      title: { en: 'Components', ru: 'Компоненты' },
      description: { en: 'Understanding Angular components', ru: 'Понимание компонентов Angular' },
      videoUrl: 'video2.mp4',
      duration: '15:00',
      order: 2
    },
    {
      id: 3,
      title: { en: 'Services', ru: 'Сервисы' },
      description: { en: 'Working with services', ru: 'Работа с сервисами' },
      videoUrl: 'video3.mp4',
      duration: '12:00',
      order: 3
    }
  ]
);

const createActivatedRouteMock = (params: any) => ({
  params: of(params),
  snapshot: {
    params: params,
    paramMap: {
      get: (key: string) => params[key],
      has: (key: string) => key in params,
      keys: Object.keys(params),
      getAll: (key: string) => [params[key]]
    }
  },
  queryParams: of({}),
  fragment: of(null),
  data: of({}),
  outlet: 'primary',
  component: null,
  routeConfig: null,
  root: null as any,
  parent: null,
  firstChild: null,
  children: [],
  pathFromRoot: [],
  paramMap: of({
    get: (key: string) => params[key],
    has: (key: string) => key in params,
    keys: Object.keys(params),
    getAll: (key: string) => [params[key]]
  }),
  queryParamMap: of({
    get: () => null,
    has: () => false,
    keys: [],
    getAll: () => []
  }),
  url: of([]),
  title: of('')
});

describe('LessonComponent Integration', () => {
  let component: Lesson;
  let fixture: ComponentFixture<Lesson>;
  let courseService: CourseService;
  let languageService: LanguageService;
  let router: Router;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Lesson, TranslocoModule],
      providers: [
        CourseService,
        LanguageService,
        { 
          provide: Router, 
          useValue: { 
            navigate: jasmine.createSpy('navigate') 
          } 
        },
        {
          provide: ActivatedRoute,
          useValue: createActivatedRouteMock({ courseId: '1', lessonId: '1' })
        },
        {
          provide: TranslocoService,
          useValue: {
            setActiveLang: jasmine.createSpy('setActiveLang'),
            getActiveLang: jasmine.createSpy('getActiveLang').and.returnValue('en'),
            load: jasmine.createSpy('load').and.returnValue(of({})),
            translate: jasmine.createSpy('translate').and.returnValue('translated')
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Lesson);
    component = fixture.componentInstance;

    courseService = TestBed.inject(CourseService);
    languageService = TestBed.inject(LanguageService);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);

    languageService.currentLang.set('en');
  });

  describe('загрузка урока', () => {
    it('должен загружать урок по courseId и lessonId', () => {
      spyOn(courseService, 'getLessonById').and.returnValue({
        course: MOCK_COURSE,
        lesson: MOCK_COURSE.lessons[0],
        lessonIndex: 0
      });

      component.ngOnInit();

      expect(courseService.getLessonById).toHaveBeenCalledWith(1, 1);
      expect(component.course()).toEqual(MOCK_COURSE);
      expect(component.lesson()).toEqual(MOCK_COURSE.lessons[0]);
      expect(component.currentLessonIndex()).toBe(0);
      expect(component.totalLessons()).toBe(3);
      expect(component.isLoading()).toBeFalse();
      expect(component.error()).toBeNull();
    });

    it('должен устанавливать ошибку если урок не найден', () => {
      spyOn(courseService, 'getLessonById').and.returnValue(null);

      component.ngOnInit();

      expect(component.error()).toBe('Lesson not found');
      expect(component.isLoading()).toBeFalse();
      expect(component.course()).toBeNull();
      expect(component.lesson()).toBeNull();
    });

    it('должен обрабатывать ошибки при загрузке урока', () => {
      spyOn(courseService, 'getLessonById').and.throwError('Test error');

      component.ngOnInit();

      expect(component.error()).toBe('Failed to load lesson');
      expect(component.isLoading()).toBeFalse();
    });
  });

  describe('локализация', () => {
    beforeEach(() => {
      spyOn(courseService, 'getLessonById').and.returnValue({
        course: MOCK_COURSE,
        lesson: MOCK_COURSE.lessons[0],
        lessonIndex: 0
      });
    });

    it('должен локализовать курс и урок на английском', () => {
      languageService.currentLang.set('en');
      component.ngOnInit();

      const localizedCourse = component.localizedCourse();
      const localizedLesson = component.localizedLesson();

      expect(localizedCourse?.title).toBe('Angular Basics');
      expect(localizedLesson?.title).toBe('Introduction to Angular');
      expect(localizedLesson?.description).toBe('Course overview and setup');
    });

    it('должен локализовать курс и урок на русском', () => {
      languageService.currentLang.set('ru');
      component.ngOnInit();

      const localizedCourse = component.localizedCourse();
      const localizedLesson = component.localizedLesson();

      expect(localizedCourse?.title).toBe('Основы Angular');
      expect(localizedLesson?.title).toBe('Введение в Angular');
      expect(localizedLesson?.description).toBe('Обзор курса и настройка');
    });
  });

  describe('навигация между уроками', () => {
    beforeEach(() => {
      spyOn(courseService, 'getLessonById').and.returnValue({
        course: MOCK_COURSE,
        lesson: MOCK_COURSE.lessons[1], // Второй урок (index 1)
        lessonIndex: 1
      });
      component.ngOnInit();
    });

    it('должен переходить к следующему уроку', () => {
      component.nextLesson();

      expect(router.navigate).toHaveBeenCalledWith(['/lesson', 1, 3]); // Следующий урок id=3
    });

    it('должен переходить к предыдущему уроку', () => {
      component.previousLesson();

      expect(router.navigate).toHaveBeenCalledWith(['/lesson', 1, 1]); // Предыдущий урок id=1
    });

    it('должен переходить к конкретному уроку', () => {
      component.navigateToLesson(3);

      expect(router.navigate).toHaveBeenCalledWith(['/lesson', 1, 3]);
    });
  });

  describe('проверка доступности навигации', () => {
    it('должен возвращать true для hasNextLesson если есть следующий урок', () => {
      spyOn(courseService, 'getLessonById').and.returnValue({
        course: MOCK_COURSE,
        lesson: MOCK_COURSE.lessons[0], // Первый урок
        lessonIndex: 0
      });
      component.ngOnInit();

      expect(component.hasNextLesson()).toBeTrue();
    });

    it('должен возвращать false для hasNextLesson если это последний урок', () => {
      spyOn(courseService, 'getLessonById').and.returnValue({
        course: MOCK_COURSE,
        lesson: MOCK_COURSE.lessons[2], // Последний урок
        lessonIndex: 2
      });
      component.ngOnInit();

      expect(component.hasNextLesson()).toBeFalse();
    });

    it('должен возвращать false для hasPreviousLesson если это первый урок', () => {
      spyOn(courseService, 'getLessonById').and.returnValue({
        course: MOCK_COURSE,
        lesson: MOCK_COURSE.lessons[0], // Первый урок
        lessonIndex: 0
      });
      component.ngOnInit();

      expect(component.hasPreviousLesson()).toBeFalse();
    });

    it('должен возвращать true для hasPreviousLesson если есть предыдущий урок', () => {
      spyOn(courseService, 'getLessonById').and.returnValue({
        course: MOCK_COURSE,
        lesson: MOCK_COURSE.lessons[1], // Второй урок
        lessonIndex: 1
      });
      component.ngOnInit();

      expect(component.hasPreviousLesson()).toBeTrue();
    });
  });

  describe('работа с параметрами маршрута', () => {
    it('должен реагировать на изменение параметров маршрута', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [Lesson, TranslocoModule],
        providers: [
          CourseService,
          LanguageService,
          { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
          { 
            provide: ActivatedRoute, 
            useValue: createActivatedRouteMock({ courseId: '2', lessonId: '5' })
          },
          {
            provide: TranslocoService,
            useValue: {
              setActiveLang: jasmine.createSpy('setActiveLang'),
              getActiveLang: jasmine.createSpy('getActiveLang').and.returnValue('en'),
              load: jasmine.createSpy('load').and.returnValue(of({})),
              translate: jasmine.createSpy('translate').and.returnValue('translated')
            }
          }
        ]
      }).compileComponents();

      const newFixture = TestBed.createComponent(Lesson);
      const newComponent = newFixture.componentInstance;
      const newCourseService = TestBed.inject(CourseService);
      
      spyOn(newCourseService, 'getLessonById').and.returnValue({
        course: MOCK_COURSE,
        lesson: MOCK_COURSE.lessons[0],
        lessonIndex: 0
      });

      newComponent.ngOnInit();

      expect(newCourseService.getLessonById).toHaveBeenCalledWith(2, 5);
    });
  });
});