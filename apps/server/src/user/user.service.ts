import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async findOrCreateGoogleUser(googleUser: Partial<User>): Promise<User> {
    let user = await this.userModel.findOne({ googleId: googleUser.googleId });

    if (!user) {
      user = await this.userModel.create({ ...googleUser, provider: 'google' });
    }
    return user;
  }

  async createLocalUser(userData: Partial<User>) {
    const hashedPassword = userData.password
      ? await bcrypt.hash(userData.password, 10)
      : undefined;

    return this.userModel.create({
      ...userData,
      password: hashedPassword,
      provider: 'local',
    });
  }
}
