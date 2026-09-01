import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRole, UserStatus } from '../admin-users/entities/user.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: {
    validateUser: jest.Mock;
    login: jest.Mock;
  };

  const user = {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    fullName: 'Admin User',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    createdAt: new Date('2026-08-31T00:00:00.000Z'),
    updatedAt: new Date('2026-08-31T00:00:00.000Z'),
  };

  beforeEach(async () => {
    authService = {
      validateUser: jest.fn(),
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('returns access token and user when credentials are valid', async () => {
      authService.validateUser.mockResolvedValue(user);
      authService.login.mockResolvedValue({
        accessToken: 'signed-token',
        user,
      });

      const result = await controller.login({
        username: 'admin',
        password: 'secret',
      });

      expect(authService.validateUser).toHaveBeenCalledWith('admin', 'secret');
      expect(authService.login).toHaveBeenCalledWith(user);
      expect(result).toEqual({
        accessToken: 'signed-token',
        user,
      });
    });

    it('throws UnauthorizedException when credentials are invalid', async () => {
      authService.validateUser.mockResolvedValue(null);

      await expect(
        controller.login({
          username: 'admin',
          password: 'wrong',
        }),
      ).rejects.toBeInstanceOf(UnauthorizedException);
      expect(authService.login).not.toHaveBeenCalled();
    });
  });
});
