describe('Главная страница', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('должна отображать приветственную секцию', () => {
    cy.get('[data-cy="home-page"]').should('exist');
    cy.get('[data-cy="hero-section"]').should('be.visible');
    cy.get('[data-cy="welcome-title"]').should('contain', 'Добро пожаловать на платформу обучения!');
  });

  it('должна показывать приветствие для авторизованного пользователя', () => {
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type('james@example.com');
    cy.get('[data-cy="password-input"]').type('password123');
    cy.get('[data-cy="submit-login"]').click();
    cy.url().should('include', '/');

    cy.get('[data-cy="user-welcome"]').should('be.visible');
    cy.get('[data-cy="welcome-back-title"]').should('contain', 'James');
    cy.get('[data-cy="teacher-badge"]').should('contain', 'Преподаватель');
    cy.get('[data-cy="teacher-description"]').should('contain', 'Создавайте курсы');
  });

  it('должна показывать доступные курсы', () => {
    cy.get('[data-cy="courses-section"]').should('be.visible');
    cy.get('[data-cy="courses-title"]').should('contain', 'Доступные курсы');

    cy.get('[data-cy="courses-grid"]').should('be.visible');
    cy.get('[data-cy^="course-card-"]').should('have.length.greaterThan', 0);

    cy.get('[data-cy^="course-card-"]').first().within(() => {
      cy.get('[data-cy="course-title"]').should('contain', 'Введение в Angular');
      cy.get('[data-cy="course-subtitle"]').should('contain', 'Frontend разработка');
      cy.get('[data-cy="course-rating"]').should('contain', 'Rating:');
      cy.get('[data-cy="course-difficulty"]').should('contain', 'Начинающий');
      cy.get('[data-cy="course-lessons"]').should('contain', 'lessons');
    });
  });

  it('должна фильтровать курсы по поиску', () => {
    cy.get('[data-cy="search-input"]').type('a');
    cy.get('[data-cy="search-input"]').type('n');

    cy.get('[data-cy^="course-card-"]').should('have.length', 1);
    cy.get('[data-cy="course-title"]').should('contain', 'Введение в Angular');
  });

  it('должна очищать фильтры', () => {
    cy.get('[data-cy="search-input"]').type('A');
    cy.get('[data-cy="search-input"]').type('n');

    cy.get('[data-cy^="course-card-"]').should('have.length', 1);

    cy.get('[data-cy="clear-filters-btn"]').click();

    cy.get('[data-cy^="course-card-"]').should('have.length.greaterThan', 1);
  });

  it('должна показывать прогресс для авторизованного пользователя', () => {
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type('james@example.com');
    cy.get('[data-cy="password-input"]').type('password123');
    cy.get('[data-cy="submit-login"]').click();
    cy.url().should('include', '/');

    cy.get('[data-cy="progress-section"]').should('be.visible');
    cy.get('[data-cy="progress-header"]').should('contain', 'Your Progress');
    cy.get('[data-cy="progress-percentage"]').should('contain', '%');
    cy.get('[data-cy="progress-bar"]').should('be.visible');
  });

  it('должна переходить к деталям курса', () => {
    cy.get('[data-cy^="course-card-"]').first().within(() => {
      cy.get('[data-cy="course-details-btn"]').click();
    });

    cy.url().should('include', '/course/');
  });

  it('должна начинать обучение для авторизованного пользователя', () => {
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type('james@example.com');
    cy.get('[data-cy="password-input"]').type('password123');
    cy.get('[data-cy="submit-login"]').click();
    cy.url().should('include', '/');

    cy.get('[data-cy^="course-card-"]').first().within(() => {
      cy.get('[data-cy="start-learning-btn"]').click();
    });
    
    cy.url().should('include', '/lesson/');
  });

  it('должна скрывать кнопку начала обучения для неавторизованного пользователя', () => {
    cy.get('[data-cy="start-learning-btn"]').should('not.exist');
  });
});