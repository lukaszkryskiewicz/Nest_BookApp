import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDTO } from './dtos/register.dto';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) { }

  public async register(registrationData: RegisterDTO): Promise<User> {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    const userData = {
      email: registrationData.email,
    };
    return this.usersService.createUser(userData, hashedPassword);
  }
}
