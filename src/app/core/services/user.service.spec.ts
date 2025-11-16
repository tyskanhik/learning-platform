import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let mockSessionStorage: { [key: string]: string };

  beforeEach(() => {
    mockSessionStorage = {};
    spyOn(sessionStorage, 'getItem').and.callFake((key: string) => 
      mockSessionStorage[key] || null
    );
    spyOn(sessionStorage, 'setItem').and.callFake((key: string, value: string) => {
      mockSessionStorage[key] = value;
    });
    spyOn(sessionStorage, 'removeItem').and.callFake((key: string) => {
      delete mockSessionStorage[key];
    });

    service = new UserService('browser' as any);
  });

  describe('Инициализация', () => {
    it('должен создавать сервис с начальными пользователями', () => {
      expect(service).toBeTruthy();
      expect(service.users().length).toBe(3);
    });
  });

  describe('Регистрация', () => {
    it('должен регистрировать нового пользователя', () => {
      const newUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'pass123',
        role: 'student' as const
      };

      service.register(newUser);

      const users = service.users();
      expect(users.length).toBe(4);
      expect(users[3].firstName).toBe('John');
      expect(users[3].email).toBe('john@example.com');
    });

    it('должен устанавливать текущего пользователя после регистрации', () => {
      const newUser = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: 'pass123',
        role: 'teacher' as const
      };

      service.register(newUser);

      expect(service.currentUser()?.firstName).toBe('Jane');
      expect(service.currentUser()?.email).toBe('jane@example.com');
    });
  });

  describe('Логин', () => {
    it('должен успешно логинить существующего пользователя', () => {
      const result = service.login('james@example.com', 'password123');

      expect(result).toBe(true);
      expect(service.currentUser()?.firstName).toBe('James');
    });

    it('должен возвращать false при неверном пароле', () => {
      const result = service.login('james@example.com', 'wrongpassword');

      expect(result).toBe(false);
      expect(service.currentUser()).toBeNull();
    });

    it('должен возвращать false при неверном email', () => {
      const result = service.login('wrong@example.com', 'password123');

      expect(result).toBe(false);
      expect(service.currentUser()).toBeNull();
    });
  });

  describe('Логаут', () => {
    it('должен разлогинивать пользователя', () => {
      service.login('james@example.com', 'password123');
      expect(service.currentUser()).toBeTruthy();

      service.logout();

      expect(service.currentUser()).toBeNull();
    });

    it('должен удалять пользователя из sessionStorage', () => {
      service.login('james@example.com', 'password123');
      service.logout();

      expect(sessionStorage.removeItem).toHaveBeenCalledWith('currentUser');
    });
  });

  describe('Session Storage', () => {
    it('должен сохранять пользователя в sessionStorage при логине', () => {
      service.login('james@example.com', 'password123');

      expect(sessionStorage.setItem).toHaveBeenCalledWith(
        'currentUser', 
        jasmine.any(String)
      );
    });

    it('должен восстанавливать пользователя из sessionStorage', () => {
      const savedUser = {
        id: 1,
        firstName: 'Saved',
        lastName: 'User',
        email: 'saved@example.com',
        password: 'pass123',
        role: 'student'
      };
      mockSessionStorage['currentUser'] = JSON.stringify(savedUser);

      const newService = new UserService('browser' as any);

      expect(newService.currentUser()?.firstName).toBe('Saved');
    });
  });
});