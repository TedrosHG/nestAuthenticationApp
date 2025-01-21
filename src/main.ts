import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/nestjs_sessions',
        collectionName: 'sessions',
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        secure: process.env.NODE_ENV === 'production', // True for production (requires HTTPS)
        httpOnly: true,
      },
    }),
  );
  // Initialize passport and session
  app.use(passport.initialize());
  app.use(passport.session());
  app.use((req, res, next) => {
    console.log('Session ID:', req.sessionID);  // Log session ID here
    next();
  });
  
  // const authService = app.get(AuthService);
  // passport.serializeUser((user, done) => authService.serializeUser(user, done));
  // passport.deserializeUser((id, done) => authService.deserializeUser(id, done));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
