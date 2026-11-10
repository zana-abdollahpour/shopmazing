import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import type { CreateUserDto } from '@repo/schemas/users';

import { HashingService } from '@/src/hashing/hashing.abstract.service.js';

import { PrismaService } from '@/src/prisma/prisma.service.js';
import { Prisma, User } from '@/src/generated/prisma/client.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<Omit<User, 'password'>> {
    try {
      const hashedPassword = await this.hashingService.hash(dto.password);

      const savedUser = await this.prismaService.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
        },
        select: { id: true, email: true },
      });

      return {
        id: savedUser.id,
        email: savedUser.email,
      };
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002' // Prisma's error code for unique constraint violation
      ) {
        throw new UnprocessableEntityException(
          'User with this email already exists',
        );
      }
      throw err;
    }
  }

  async getUser(filter: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.findUniqueOrThrow({ where: filter });
  }
}
