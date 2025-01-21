import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import e from 'express';


@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}

    async validateUser(email:string, password:string): Promise<any> {
        const user = await this.userService.findOne(email);
        if (user && await bcrypt.compare(password, user.password)) {
            const {name, email, id} = user
            return {name, email, id}
        }

        return null;
    }

    async register(createUserDto: CreateUserDto): Promise<any> {
    const { email, password, name } = createUserDto;

    // Check if user with this email already exists
    const existingUser = await this.userService.findOne(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    return await this.userService.create(createUserDto)
  }

    // // Serialize user
    // serializeUser(user: any, done: (err: any, user: any) => void) {
    //   console.log('ser',user.id);
      
    //   done(null, user.id); // Save user ID in the session
    // }
  
    // // Deserialize user
    // async deserializeUser(id: any, done: (err: any, user: any) => void) {
    //   const theUser = await this.userService.findOneById(id); // Retrieve user by ID
    //   console.log('deser',theUser, id);
      
    //   done(null, theUser);
    // }
  
}
