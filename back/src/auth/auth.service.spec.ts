import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AdminUsersService } from '../admin-users/admin-users.service';
import { JwtService } from '@nestjs/jwt';
import { UserRole, UserStatus } from '../admin-users/entities/user.entity';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let adminUsersService: { findByUsername: jest.Mock };
  let jwtService: { sign: jest.Mock };

  const user = {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    passwordHash: 'hashed-password',
    fullName: 'Admin User',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
    createdAt: new Date('2026-08-31T00:00:00.000Z'),
    updatedAt: new Date('2026-08-31T00:00:00.000Z'),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    adminUsersService = {
      findByUsername: jest.fn(),
    };
    jwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AdminUsersService, useValue: adminUsersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('returns the user without passwordHash when credentials are valid', async () => {
      adminUsersService.findByUsername.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('admin', 'secret');

      expect(adminUsersService.findByUsername).toHaveBeenCalledWith('admin');
      expect(bcrypt.compare).toHaveBeenCalledWith('secret', 'hashed-password');
      expect(result).toEqual({
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
      expect(result).not.toHaveProperty('passwordHash');
    });

    it('returns null when the user does not exist', async () => {
      adminUsersService.findByUsername.mockResolvedValue(null);

      const result = await service.validateUser('missing', 'secret');

      expect(result).toBeNull();
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('returns null when the password is invalid', async () => {
      adminUsersService.findByUsername.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('admin', 'wrong');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('signs a JWT with username, id, and role, then returns token and user', async () => {
      const { passwordHash, ...safeUser } = user;
      jwtService.sign.mockReturnValue('signed-token');

      const result = await service.login(safeUser);

      expect(jwtService.sign).toHaveBeenCalledWith({
        username: safeUser.username,
        sub: safeUser.id,
        role: safeUser.role,
      });
      expect(result).toEqual({
        accessToken: 'signed-token',
        user: safeUser,
      });
    });
  });
});
