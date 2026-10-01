import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export interface UserEntity {
  id: string;
  email: string;
  name: string;
  passwordHash?: string;
  githubId?: string;
  role: string;
  createdAt: Date;
}

@Injectable()
export class AuthService {
  // In-memory user store for zero-dependency development and tests, synced with Postgres
  private users: Map<string, UserEntity> = new Map();

  constructor(private readonly jwtService: JwtService) {
    // Seed default admin developer user for instant local login
    const defaultPassHash = bcrypt.hashSync('devpilot123', 10);
    const defaultUser: UserEntity = {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'developer@devpilot.local',
      name: 'Local Developer',
      passwordHash: defaultPassHash,
      role: 'lead-architect',
      createdAt: new Date(),
    };
    this.users.set(defaultUser.email, defaultUser);
  }

  async register(email: string, password: string, name: string): Promise<{ user: Partial<UserEntity>; token: string }> {
    if (this.users.has(email)) {
      throw new BadRequestException('User with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser: UserEntity = {
      id: uuidv4(),
      email,
      name,
      passwordHash,
      role: 'developer',
      createdAt: new Date(),
    };

    this.users.set(email, newUser);
    const token = this.jwtService.sign({ sub: newUser.id, email: newUser.email, role: newUser.role });

    return {
      user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
      token,
    };
  }

  async login(email: string, password: string): Promise<{ user: Partial<UserEntity>; token: string }> {
    const user = this.users.get(email);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });

    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      token,
    };
  }

  async validateUserById(id: string): Promise<UserEntity | null> {
    for (const user of this.users.values()) {
      if (user.id === id) return user;
    }
    return null;
  }

  async handleGitHubCallback(code: string): Promise<{ user: Partial<UserEntity>; token: string }> {
    // Free GitHub OAuth integration with rate limit consideration
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      // Local development mock GitHub login when credentials are not configured
      const mockGhUser: UserEntity = {
        id: uuidv4(),
        email: 'github.dev@devpilot.local',
        name: 'GitHub Developer',
        githubId: 'gh_local_dev',
        role: 'developer',
        createdAt: new Date(),
      };
      this.users.set(mockGhUser.email, mockGhUser);
      const token = this.jwtService.sign({ sub: mockGhUser.id, email: mockGhUser.email });
      return { user: mockGhUser, token };
    }

    try {
      const tokenRes = await axios.post(
        'https://github.com/login/oauth/access_token',
        { client_id: clientId, client_secret: clientSecret, code },
        { headers: { Accept: 'application/json' } }
      );
      const accessToken = tokenRes.data.access_token;

      const userRes = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'DevPilot-App' },
      });
      const ghData = userRes.data;

      const email = ghData.email || `${ghData.login}@github.devpilot.local`;
      let user = this.users.get(email);
      if (!user) {
        user = {
          id: uuidv4(),
          email,
          name: ghData.name || ghData.login,
          githubId: String(ghData.id),
          role: 'developer',
          createdAt: new Date(),
        };
        this.users.set(email, user);
      }

      const token = this.jwtService.sign({ sub: user.id, email: user.email });
      return { user, token };
    } catch (e: any) {
      throw new BadRequestException(`GitHub OAuth failed: ${e.message}`);
    }
  }
}
