import { JwtPayload } from '@food-delivery/types';
import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import type { Database } from '../db/database';
import { NewUser, User, users } from '../db/schema/users';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
@Injectable()
export class AuthService {
  constructor(
    @Inject('DB') private readonly db: Database,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const [existing] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, dto.email));

    if (existing) throw new ConflictException('Email already in use');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const [user] = await this.db
      .insert(users)
      .values({
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
      })
      .returning();

    return {
      user: this.sanitizeUser(user),
      token: this.generateToken(user),
    };
  }

  async login(dto: LoginDto) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, dto.email));

    if (!user) throw new UnauthorizedException('Invalid Credentials');
    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatch) throw new UnauthorizedException('Invalid Credentials');
    return {
      user: this.sanitizeUser(user),
      token: this.generateToken(user),
    };
  }

  private generateToken(user: NewUser) {
    const payload: JwtPayload = {
      sub: user.id!,
      email: user.email,
      role: user.role!,
    };
    return this.jwtService.sign(payload);
  }
  private sanitizeUser(user: User) {
    const { password, ...safeUser } = user;
    void password;
    return safeUser;
  }
}
