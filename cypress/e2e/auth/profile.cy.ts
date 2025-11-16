describe('Профиль пользователя', () => {
  beforeEach(() => {
    // Логинимся перед каждым тестом профиля
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type('james@example.com');
    cy.get('[data-cy="password-input"]').type('password123');
    cy.get('[data-cy="submit-login"]').click();
    cy.url().should('include', '/');
    cy.visit('/profile');
  });

  it('должен отображать информацию о пользователе', () => {
    cy.get('[data-cy="profile-page"]').should('exist');
    cy.get('[data-cy="user-fullname"]').should('contain', 'James Hetfield');
    cy.get('[data-cy="user-email"]').should('contain', 'james@example.com');
    cy.get('[data-cy="user-role"]').should('contain', 'Teacher');
    cy.get('[data-cy="user-avatar"]').should('contain', 'JH');
  });

  it('должен позволять редактировать профиль', () => {
    cy.get('[data-cy="edit-profile-btn"]').click();

    cy.get('[data-cy="first-name-input"]').should('not.have.attr', 'readonly');
    cy.get('[data-cy="last-name-input"]').should('not.have.attr', 'readonly');
    cy.get('[data-cy="email-input"]').should('not.have.attr', 'readonly');

    cy.get('[data-cy="password-section"]').should('be.visible');

    cy.get('[data-cy="first-name-input"]').clear().type('Джеймс');
    cy.get('[data-cy="last-name-input"]').clear().type('Хетфилд');

    cy.get('[data-cy="save-profile-btn"]').click();

    cy.contains('Profile updated successfully').should('be.visible');

    cy.get('[data-cy="user-fullname"]').should('contain', 'Джеймс Хетфилд');
  });

  it('должен отменять редактирование профиля', () => {
    cy.get('[data-cy="edit-profile-btn"]').click();

    cy.get('[data-cy="first-name-input"]').clear().type('НовоеИмя');

    cy.get('[data-cy="cancel-edit-btn"]').click();

    cy.get('[data-cy="first-name-input"]').should('have.value', 'James');
    cy.get('[data-cy="user-fullname"]').should('contain', 'James Hetfield');
  });

  it('должен показывать ошибки валидации при редактировании', () => {
    cy.get('[data-cy="edit-profile-btn"]').click();

    cy.get('[data-cy="first-name-input"]').clear().blur();

    cy.get('[data-cy="first-name-error"]').should('contain', 'Это поле обязательно для заполнения');

    cy.get('[data-cy="save-profile-btn"]').should('be.disabled');
  });

  it('должен выходить из системы', () => {
    cy.get('[data-cy="logout-btn"]').click();

    cy.url().should('include', '/');

    cy.get('[data-cy="login-btn"]').should('be.visible');
    cy.get('[data-cy="register-btn"]').should('be.visible');

    cy.get('[data-cy="user-menu"]').should('not.exist');
  });

  it('должен показывать статистику для студента', () => {
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type('elvis@example.com');
    cy.get('[data-cy="password-input"]').type('password123');
    cy.get('[data-cy="submit-login"]').click();
    cy.url().should('include', '/');
    cy.visit('/profile');

    cy.get('[data-cy="stats-card"]').should('be.visible');
    cy.get('[data-cy="stats-title"]').should('contain', 'Мой прогресс');
    cy.get('[data-cy="completed-courses"]').should('contain', 'Пройдено курсов');
    cy.get('[data-cy="completed-lessons"]').should('contain', 'Завершено уроков');
    cy.get('[data-cy="learning-time"]').should('contain', 'Время обучения');
  });
});