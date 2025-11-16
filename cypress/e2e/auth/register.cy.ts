describe('Регистрация пользователя', () => {
  beforeEach(() => {
    cy.visit('/register');
  });

  it('должна отображать страницу регистрации', () => {
    cy.get('[data-cy="register-page"]').should('exist');
    cy.get('[data-cy="register-title"]').should('contain', 'Регистрация');
    cy.get('[data-cy="register-form"]').should('be.visible');
  });

  it('должна успешно зарегистрировать нового студента', () => {
    const timestamp = Date.now();
    const email = `student${timestamp}@example.com`;

    cy.get('[data-cy="first-name-input"]').type('Иван');
    cy.get('[data-cy="last-name-input"]').type('Петров');
    cy.get('[data-cy="email-input"]').type(email);
    cy.get('[data-cy="role-select"]').click();
    cy.get('[data-cy="student-option"]').click();
    cy.get('[data-cy="password-input"]').type('password123');

    cy.get('[data-cy="confirm-password-input"]').type('password123', { force: true });

    cy.wait(1000);

    cy.get('[data-cy="submit-register"]').should('not.be.disabled');

    cy.get('[data-cy="submit-register"]').click();

    cy.url().should('include', '/');
    cy.get('[data-cy="user-name"]').should('contain', 'Иван');
  });

  it('должна показывать ошибку при некорректном email', () => {
    cy.get('[data-cy="email-input"]').type('invalid-email');
    cy.get('[data-cy="email-input"]').blur();

    cy.wait(500);
    
    cy.get('[data-cy="email-error"]').should('contain', 'Введите действительный адрес электронной почты');
  });

  it('должна переходить на страницу входа по ссылке', () => {
    cy.get('[data-cy="login-link"]').click();
    
    cy.url().should('include', '/login');
    cy.get('[data-cy="login-page"]').should('exist');
  });

  it('должна активировать кнопку только при совпадающих паролях', () => {
    cy.get('[data-cy="first-name-input"]').type('Тест');
    cy.get('[data-cy="email-input"]').type('test@example.com');
    cy.get('[data-cy="password-input"]').type('password123');

    cy.get('[data-cy="submit-register"]').should('be.disabled');

    cy.get('[data-cy="confirm-password-input"]').type('wrongpassword', { force: true });
    cy.wait(1000);

    cy.get('[data-cy="submit-register"]').should('be.disabled');

    cy.get('[data-cy="confirm-password-input"]').clear().type('password123', { force: true });
    cy.wait(1000);

    cy.get('[data-cy="submit-register"]').should('not.be.disabled');
  });
});