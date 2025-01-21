import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FirebaseModule } from './firebase/firebase.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    FirebaseModule,
    MongooseModule.forRoot('mongodb://localhost:27017/nestjs_sessions'),
    PassportModule.register({ session: true }), // Enable session
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
