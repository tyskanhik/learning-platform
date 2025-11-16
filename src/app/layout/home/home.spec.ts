import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home';
import { UserService } from '../../core/services/user.service';
import { CourseService } from '../../core/services/course.service';
import { LanguageService } from '../../core/services/language.service';
import { Router } from '@angular/router';
import { TranslocoService, TranslocoModule } from '@jsverse/transloco';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { UserModel } from '../../core/models/user.model';
import { CourseModel } from '../../core/models/course.model';

// Мок данные для курсов
const MOCK_COURSES = [
  new CourseModel(
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
        title: { en: 'Introduction', ru: 'Введение' },
        description: { en: 'Course overview', ru: 'Обзор курса' },
        videoUrl: 'video1.mp4',
        duration: '10:00',
        order: 1
      }
    ]
  ),
  new CourseModel(
    2,
    { en: 'Advanced TypeScript', ru: 'Продвинутый TypeScript' },
    { en: 'Programming', ru: 'Программирование' },
    4.8,
    'Jane Smith',
    { en: 'Deep dive into TypeScript', ru: 'Погружение в TypeScript' },
    [
      { en: 'Master types', ru: 'Освоить типы' },
      { en: 'Learn generics', ru: 'Изучить дженерики' }
    ],
    [
      { en: 'Advanced Types', ru: 'Продвинутые типы' },
      { en: 'Generics', ru: 'Дженерики' }
    ],
    'advanced',
    [
      {
        id: 1,
        title: { en: 'Types', ru: 'Типы' },
        description: { en: 'Type system', ru: 'Система типов' },
        videoUrl: 'video2.mp4',
        duration: '15:00',
        order: 1
      }
    ]
  )
];

describe('HomeComponent Integration', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let userService: UserService;
  let courseService: CourseService;
  let languageService: LanguageService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home, TranslocoModule],
      providers: [
        UserService,
        CourseService,
        LanguageService,
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: ActivatedRoute, useValue: {} },
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

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;

    userService = TestBed.inject(UserService);
    courseService = TestBed.inject(CourseService);
    languageService = TestBed.inject(LanguageService);
    router = TestBed.inject(Router);

    (courseService as any).coursesSignal.set(MOCK_COURSES);

    languageService.currentLang.set('en');
  });
  
  it('должен загружать курсы из CourseService', () => {
    component.ngOnInit();
    
    expect(component.courses().length).toBe(2);
    expect(component.courses()[0].id).toBe(1);
    expect(component.courses()[1].id).toBe(2);
  });

  it('должен локализовать курсы на английском языке', () => {
    languageService.currentLang.set('en');
    component.ngOnInit();
    
    const localizedCourses = component.localizedCourses();
    
    expect(localizedCourses[0].title).toBe('Angular Basics');
    expect(localizedCourses[0].description).toBe('Learn Angular fundamentals');
    expect(localizedCourses[0].category).toBe('Web Development');
  });

  it('должен локализовать курсы на русском языке', () => {
    languageService.currentLang.set('ru');
    component.ngOnInit();
    
    const localizedCourses = component.localizedCourses();
    
    expect(localizedCourses[0].title).toBe('Основы Angular');
    expect(localizedCourses[0].description).toBe('Изучите основы Angular');
    expect(localizedCourses[0].category).toBe('Веб-разработка');
  });

  it('должен фильтровать курсы по поисковому запросу на английском', () => {
    languageService.currentLang.set('en');
    component.ngOnInit();
    
    component.searchTerm.set('Angular');
    const filteredCourses = component.filteredCourses();
    
    expect(filteredCourses.length).toBe(1);
    expect(filteredCourses[0].title).toBe('Angular Basics');
  });

  it('должен фильтровать курсы по поисковому запросу на русском', () => {
    languageService.currentLang.set('ru');
    component.ngOnInit();
    
    component.searchTerm.set('Angular');
    const filteredCourses = component.filteredCourses();
    
    expect(filteredCourses.length).toBe(1);
    expect(filteredCourses[0].title).toBe('Основы Angular');
  });

  it('должен фильтровать курсы по категории на английском', () => {
    languageService.currentLang.set('en');
    component.ngOnInit();
    
    component.selectedCategory.set('Web Development');
    const filteredCourses = component.filteredCourses();
    
    expect(filteredCourses.length).toBe(1);
    expect(filteredCourses[0].category).toBe('Web Development');
    expect(filteredCourses[0].title).toBe('Angular Basics');
  });

  it('должен фильтровать курсы по категории на русском', () => {
    languageService.currentLang.set('ru');
    component.ngOnInit();
    
    component.selectedCategory.set('Веб-разработка');
    const filteredCourses = component.filteredCourses();
    
    expect(filteredCourses.length).toBe(1);
    expect(filteredCourses[0].category).toBe('Веб-разработка');
    expect(filteredCourses[0].title).toBe('Основы Angular');
  });

  it('должен фильтровать курсы по сложности', () => {
    component.ngOnInit();
    
    component.selectedDifficulty.set('advanced');
    const filteredCourses = component.filteredCourses();
    
    expect(filteredCourses.length).toBe(1);
    expect(filteredCourses[0].difficulty).toBe('advanced');
    expect(filteredCourses[0].title).toBe('Advanced TypeScript');
  });

  it('должен комбинировать несколько фильтров на английском', () => {
    languageService.currentLang.set('en');
    component.ngOnInit();
    
    component.searchTerm.set('TypeScript');
    component.selectedDifficulty.set('advanced');
    const filteredCourses = component.filteredCourses();
    
    expect(filteredCourses.length).toBe(1);
    expect(filteredCourses[0].title).toBe('Advanced TypeScript');
  });

  it('должен комбинировать несколько фильтров на русском', () => {
    languageService.currentLang.set('ru');
    component.ngOnInit();
    
    component.searchTerm.set('TypeScript');
    component.selectedDifficulty.set('advanced');
    const filteredCourses = component.filteredCourses();
    
    expect(filteredCourses.length).toBe(1);
    expect(filteredCourses[0].title).toBe('Продвинутый TypeScript');
  });


  it('должен очищать все фильтры', () => {
    component.ngOnInit();
    
    component.searchTerm.set('test');
    component.selectedCategory.set('test');
    component.selectedDifficulty.set('beginner');
    
    component.clearFilters();
    
    expect(component.searchTerm()).toBe('');
    expect(component.selectedCategory()).toBe('');
    expect(component.selectedDifficulty()).toBe('');
  });

  it('должен возвращать прогресс для курса', () => {
    component.ngOnInit();
    
    const progress = component.getCourseProgress(1);
    
    expect(typeof progress).toBe('number');
    expect(progress).toBeGreaterThanOrEqual(0);
    expect(progress).toBeLessThanOrEqual(100);
  });

  it('должен возвращать одинаковый прогресс для одного courseId', () => {
    component.ngOnInit();
    
    const progress1 = component.getCourseProgress(1);
    const progress2 = component.getCourseProgress(1);
    
    expect(progress1).toBe(progress2);
  });

  describe('навигация', () => {
    it('должен перенаправлять на первый урок при начале обучения', () => {
      component.ngOnInit();
      
      const course = component.localizedCourses()[0];
      component.startLearning(course);
      
      expect(router.navigate).toHaveBeenCalledWith(['/lesson', 1, 1]);
    });

    it('должен перенаправлять на детали курса', () => {
      component.ngOnInit();
      
      component.viewCourseDetails(1);
      
      expect(router.navigate).toHaveBeenCalledWith(['/course', 1]);
    });
  });

  describe('работа с пользователем', () => {
    it('должен получать текущего пользователя из UserService', () => {
      const testUser = new UserModel(1, 'John', 'Doe', 'john@test.com', 'pass', 'student');
      (userService as any).currentUserSignal.set(testUser);
      
      fixture = TestBed.createComponent(Home);
      component = fixture.componentInstance;
      
      expect(component.currentUser()).toEqual(testUser);
    });

    it('должен работать когда пользователь не авторизован', () => {
      (userService as any).currentUserSignal.set(null);
      
      fixture = TestBed.createComponent(Home);
      component = fixture.componentInstance;
      
      expect(component.currentUser()).toBeNull();
    });
  });

  it('должен переводить уровень сложности на английский', () => {
    languageService.currentLang.set('en');
    
    const difficultyText = component.getDifficultyText('beginner');
    
    expect(difficultyText).toBe('Beginner');
  });

  it('должен переводить уровень сложности на русский', () => {
    languageService.currentLang.set('ru');
    
    const difficultyText = component.getDifficultyText('beginner');
    
    expect(difficultyText).toBe('Начинающий');
  });
});