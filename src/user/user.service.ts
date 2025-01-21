import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/model/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: Partial<User>): Promise<any> {
    const hashedPassword = await bcrypt.hash(user.password, 10); // Hash the password with a salt round of 10

    const newUser = new this.userModel({
      name: user.name,
      email: user.email,
      password: hashedPassword,
    });

    const createdUser = await newUser.save(); // Save the new user to the database
    // Return user data (excluding password)
    const { email, name, _id } = createdUser.toObject();
    return {
      email,
      name,
      id: _id,
    };
  }

  async findOne(theEmail: string){
    const user = await this.userModel.findOne({ email: theEmail }).exec();
    if(!user){
      return null
    }
    const { email, name, _id, password } = user;
    return {
      email,
      name,
      id: _id,
      password
    };
  }

  async findOneById(_id: any){
    const user = await this.userModel.findOne({ _id }).exec();
    if(!user){
      return null
    }
    const { email, name, password } = user;
    return {
      email,
      name,
      id: user._id,
      password
    };
  }
  
}
