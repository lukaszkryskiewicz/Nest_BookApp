import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaServices: PrismaService) { }

  public getAll(): any {
    return this.prismaServices.user.findMany({});
  }

  public getById(id: User['id']): Promise<User | null> {
    return this.prismaServices.user.findUnique({
      where: { id },
    });
  }

  public getByMail(email: User['email']): Promise<User | null> {
    return this.prismaServices.user.findUnique({
      where: { email },
      include: { password: true },
    });
  }

  public async createUser(
    userData: Omit<User, 'id' | 'role'>,
    password: string,
  ): Promise<User> {
    try {
      return await this.prismaServices.user.create({
        data: {
          ...userData,
          password: {
            create: {
              hashedPassword: password,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2002')
        throw new ConflictException('Email is already taken');
      throw error;
    }
  }

  public async updateUser(
    id: User['id'],
    userData: Omit<User, 'id' | 'role'>,
    password: string | undefined,
  ): Promise<User> {
    try {
      if (password) {
        return await this.prismaServices.user.update({
          where: { id },
          data: {
            ...userData,
            password: {
              update: {
                hashedPassword: password,
              },
            },
          },
        });
      } else {
        return await this.prismaServices.user.update({
          where: { id },
          data: userData,
        });
      }
    } catch (error) {
      if (error.code === 'P2002')
        throw new ConflictException('Email is already taken');
      throw error;
    }
  }

  public delete(id: User['id']): Promise<User> {
    return this.prismaServices.user.delete({
      where: { id },
    });
  }
}
