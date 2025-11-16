import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CourseDetails } from './course-details';
import { CourseService } from '../../core/services/course.service';
import { UserService } from '../../core/services/user.service';
import { LanguageService } from '../../core/services/language.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslocoService, TranslocoModule } from '@jsverse/transloco';
import { of } from 'rxjs';
import { CourseModel } from '../../core/models/course.model';
import { UserModel } from '../../core/models/user.model';

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
    { en: 'Components', ru: 'Компоненты' },
    { en: 'Services', ru: 'Сервисы' }
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
    }
  ]
);

const createActivatedRouteMock = (params: any) => ({
  snapshot: {
    params: params,
    paramMap: {
      get: (key: string) => params[key],
      has: (key: string) => key in params,
      keys: Object.keys(params),
      getAll: (key: string) => [params[key]]
    }
  },
  params: of(params),
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

describe('CourseDetailsComponent Integration', () => {
  let component: CourseDetails;
  let fixture: ComponentFixture<CourseDetails>;
  let courseService: CourseService;
  let userService: UserService;
  let languageService: LanguageService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourseDetails, TranslocoModule],
      providers: [
        CourseService,
        UserService,
        LanguageService,
        { 
          provide: Router, 
          useValue: { 
            navigate: jasmine.createSpy('navigate') 
          } 
        },
        {
          provide: ActivatedRoute,
          useValue: createActivatedRouteMock({ id: '1' })
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

    fixture = TestBed.createComponent(CourseDetails);
    component = fixture.componentInstance;

    courseService = TestBed.inject(CourseService);
    userService = TestBed.inject(UserService);
    languageService = TestBed.inject(LanguageService);
    router = TestBed.inject(Router);

    languageService.currentLang.set('en');
  });

  describe('инициализация', () => {
    it('должен загружать курс по ID из параметров маршрута', () => {
      spyOn(courseService, 'getCourseById').and.returnValue(MOCK_COURSE);

      component.ngOnInit();

      expect(courseService.getCourseById).toHaveBeenCalledWith(1);
      expect(component.course()).toEqual(MOCK_COURSE);
      expect(component.isLoading()).toBeFalse();
    });

    it('должен устанавливать прогресс если пользователь авторизован', () => {
      const testUser = new UserModel(1, 'John', 'Doe', 'john@test.com', 'pass', 'student');
      (userService as any).currentUserSignal.set(testUser);
      spyOn(courseService, 'getCourseById').and.returnValue(MOCK_COURSE);

      component.ngOnInit();

      expect(component.progress()).toBeGreaterThanOrEqual(0);
      expect(component.progress()).toBeLessThanOrEqual(100);
    });

    it('не должен устанавливать прогресс если пользователь не авторизован', () => {
      (userService as any).currentUserSignal.set(null);
      spyOn(courseService, 'getCourseById').and.returnValue(MOCK_COURSE);

      component.ngOnInit();

      expect(component.progress()).toBe(0);
    });

    it('должен использовать кэшированный прогресс для одного courseId', () => {
      const testUser = new UserModel(1, 'John', 'Doe', 'john@test.com', 'pass', 'student');
      (userService as any).currentUserSignal.set(testUser);
      spyOn(courseService, 'getCourseById').and.returnValue(MOCK_COURSE);

      component.ngOnInit();
      const firstProgress = component.progress();

      component.ngOnInit();
      const secondProgress = component.progress();

      expect(firstProgress).toBe(secondProgress);
    });

    it('должен обрабатывать случай когда курс не найден', () => {
      spyOn(courseService, 'getCourseById').and.returnValue(undefined);

      component.ngOnInit();

      expect(component.course()).toBeNull();
      expect(component.isLoading()).toBeFalse();
    });
  });

  describe('локализация', () => {
    beforeEach(() => {
      spyOn(courseService, 'getCourseById').and.returnValue(MOCK_COURSE);
    });

    it('должен локализовать курс на английском языке', () => {
      languageService.currentLang.set('en');
      component.ngOnInit();

      const localizedCourse = component.localizedCourse();

      expect(localizedCourse?.title).toBe('Angular Basics');
      expect(localizedCourse?.description).toBe('Learn Angular fundamentals');
      expect(localizedCourse?.category).toBe('Web Development');
      expect(localizedCourse?.objectives).toEqual(['Understand components', 'Learn services']);
      expect(localizedCourse?.program).toEqual(['Introduction', 'Components', 'Services']);
      expect(localizedCourse?.lessons[0].title).toBe('Introduction to Angular');
    });

    it('должен локализовать курс на русском языке', () => {
      languageService.currentLang.set('ru');
      component.ngOnInit();

      const localizedCourse = component.localizedCourse();

      expect(localizedCourse?.title).toBe('Основы Angular');
      expect(localizedCourse?.description).toBe('Изучите основы Angular');
      expect(localizedCourse?.category).toBe('Веб-разработка');
      expect(localizedCourse?.objectives).toEqual(['Понять компоненты', 'Изучить сервисы']);
      expect(localizedCourse?.program).toEqual(['Введение', 'Компоненты', 'Сервисы']);
      expect(localizedCourse?.lessons[0].title).toBe('Введение в Angular');
    });
  });

  describe('навигация', () => {
    beforeEach(() => {
      spyOn(courseService, 'getCourseById').and.returnValue(MOCK_COURSE);
      component.ngOnInit();
    });

    it('должен перенаправлять к уроку если пользователь авторизован', () => {
      const testUser = new UserModel(1, 'John', 'Doe', 'john@test.com', 'pass', 'student');
      (userService as any).currentUserSignal.set(testUser);

      component.navigateToLesson(1, 2);

      expect(router.navigate).toHaveBeenCalledWith(['/lesson', 1, 2]);
    });

    it('не должен перенаправлять к уроку если пользователь не авторизован', () => {
      (userService as any).currentUserSignal.set(null);

      component.navigateToLesson(1, 2);

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('перевод уровней сложности', () => {
    it('должен переводить уровень сложности на английском', () => {
      languageService.currentLang.set('en');

      const difficultyText = component.getDifficultyText('beginner');
      expect(difficultyText).toBe('Beginner');

      const intermediateText = component.getDifficultyText('intermediate');
      expect(intermediateText).toBe('Intermediate');

      const advancedText = component.getDifficultyText('advanced');
      expect(advancedText).toBe('Advanced');
    });

    it('должен переводить уровень сложности на русском', () => {
      languageService.currentLang.set('ru');

      const difficultyText = component.getDifficultyText('beginner');
      expect(difficultyText).toBe('Начинающий');

      const intermediateText = component.getDifficultyText('intermediate');
      expect(intermediateText).toBe('Средний');

      const advancedText = component.getDifficultyText('advanced');
      expect(advancedText).toBe('Продвинутый');
    });
  });

  describe('работа с разными ID курсов', () => {
    it('должен загружать курс с другим ID', () => {
      const differentCourse = new CourseModel(
        2,
        { en: 'React Course', ru: 'Курс React' },
        { en: 'Frontend', ru: 'Фронтенд' },
        4.2,
        'Jane Smith',
        { en: 'Learn React', ru: 'Изучите React' },
        [],
        [],
        'intermediate',
        []
      );

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [CourseDetails, TranslocoModule],
        providers: [
          CourseService,
          UserService,
          LanguageService,
          { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
          { 
            provide: ActivatedRoute, 
            useValue: createActivatedRouteMock({ id: '2' })
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

      const newFixture = TestBed.createComponent(CourseDetails);
      const newComponent = newFixture.componentInstance;
      const newCourseService = TestBed.inject(CourseService);
      
      spyOn(newCourseService, 'getCourseById').and.returnValue(differentCourse);

      newComponent.ngOnInit();

      expect(newCourseService.getCourseById).toHaveBeenCalledWith(2);
      expect(newComponent.course()).toEqual(differentCourse);
    });
  });

  describe('структура локализованного курса', () => {
    beforeEach(() => {
      spyOn(courseService, 'getCourseById').and.returnValue(MOCK_COURSE);
      component.ngOnInit();
    });

    it('должен сохранять все основные свойства курса', () => {
      const localizedCourse = component.localizedCourse();

      expect(localizedCourse?.id).toBe(1);
      expect(localizedCourse?.author).toBe('John Doe');
      expect(localizedCourse?.rating).toBe(4.5);
      expect(localizedCourse?.difficulty).toBe('beginner');
    });

    it('должен локализовать все уроки', () => {
      const localizedCourse = component.localizedCourse();

      expect(localizedCourse?.lessons.length).toBe(2);
      expect(localizedCourse?.lessons[0].id).toBe(1);
      expect(localizedCourse?.lessons[0].videoUrl).toBe('video1.mp4');
      expect(localizedCourse?.lessons[0].duration).toBe('10:00');
      expect(localizedCourse?.lessons[0].order).toBe(1);
      expect(localizedCourse?.lessons[1].id).toBe(2);
      expect(localizedCourse?.lessons[1].order).toBe(2);
    });
  });
});