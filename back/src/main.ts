import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security Headers (Helmet)
  app.use(helmet());

  const reflector = app.get(Reflector);

  // Global Validation Pipe (ตามมาตรฐาน)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global Guards (JWT + Roles)
  app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));

  // Global Response Interceptor (Standard Format)
  app.useGlobalInterceptors(new TransformInterceptor());

  // Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
