describe('Вход в систему', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('должен отображать страницу входа', () => {
    cy.get('[data-cy="login-page"]').should('exist');
    cy.get('[data-cy="login-title"]').should('contain', 'Вход');
    cy.get('[data-cy="login-form"]').should('be.visible');
  });

  it('должен успешно войти с правильными данными', () => {
    cy.get('[data-cy="email-input"]').type('james@example.com');
    cy.get('[data-cy="password-input"]').type('password123');
    
    cy.get('[data-cy="submit-login"]').click();
    
    cy.url().should('include', '/');
    cy.get('[data-cy="user-name"]').should('contain', 'James');
  });

  it('должен показывать ошибку при неверных данных', () => {
    cy.get('[data-cy="email-input"]').type('wrong@example.com');
    cy.get('[data-cy="password-input"]').type('wrongpassword');
    
    cy.get('[data-cy="submit-login"]').click();
    
    cy.get('[data-cy="invalid-credentials-error"]')
      .should('be.visible')
      .and('contain', 'Неверный адрес электронной почты или пароль');
  });

  it('должен переключать видимость пароля', () => {
    cy.get('[data-cy="password-input"]').type('mypassword');

    cy.get('[data-cy="password-input"]').should('have.attr', 'type', 'password');

    cy.get('[data-cy="toggle-password"]').click();
    cy.get('[data-cy="password-input"]').should('have.attr', 'type', 'text');

    cy.get('[data-cy="toggle-password"]').click();
    cy.get('[data-cy="password-input"]').should('have.attr', 'type', 'password');
  });

  it('должен переходить на страницу регистрации по ссылке', () => {
    cy.get('[data-cy="register-link"]').click();
    
    cy.url().should('include', '/register');
    cy.get('[data-cy="register-page"]').should('exist');
  });
});