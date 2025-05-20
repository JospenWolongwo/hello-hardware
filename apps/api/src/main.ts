import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import type { NextFunction, Request, Response } from 'express';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { nestCsrf } from 'ncsrf';
import { Logger as PinoLogger, LoggerErrorInterceptor } from 'nestjs-pino';
import { join } from 'path';
import { swaggerConfig, swaggerOptions } from './common/config/swagger.config';
import { GoogleRecaptchaFilter } from './common/filters/googleRecaptcha.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true });
  const PORT = parseInt(<string>process.env.PORT) || 3002;
  const isProduction = process.env.NODE_ENV === 'production';

  // Set API prefix for backend routes
  app.setGlobalPrefix('api', {
    exclude: ['/'], // Keep root route accessible
  });

  // Common middlewares and pipes
  app.useLogger(app.get(PinoLogger));
  app.use(cookieParser());
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useGlobalFilters(new GoogleRecaptchaFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  // Configure Swagger for API documentation
  const document = SwaggerModule.createDocument(app, swaggerConfig, swaggerOptions);
  SwaggerModule.setup('api/docs', app, document);

  if (isProduction) {
    // In production: serve Angular app from dist/client
    app.useStaticAssets(join(__dirname, '..', 'client'));

    // For any non-API routes, serve the Angular app
    app.use('*', (req: Request, res: Response, next: NextFunction) => {
      if (req.originalUrl.startsWith('/api')) {
        next();

        return;
      }
      res.sendFile(join(__dirname, '..', 'client', 'index.html'));
    });

    // Configure CSRF protection carefully for SPA
    app.use(
      nestCsrf({
        excludedMethods: ['GET', 'HEAD', 'OPTIONS'],
        cookieOptions: {
          httpOnly: true,
          sameSite: 'strict',
          secure: true,
        },
      })
    );
  } else {
    // In development: Configure CORS for Angular development server
    app.enableCors({
      origin: 'http://localhost:4200',
      credentials: true,
    });

    // Use CSRF protection with development settings
    app.use(nestCsrf());
  }

  await app.listen(PORT, () => {
    Logger.log(`🚀 Application is running on: http://localhost:${PORT}/`);
    if (!isProduction) {
      Logger.log(`📚 API Documentation available at: http://localhost:${PORT}/api/docs`);
      Logger.log(`🔌 Angular development server should run on: http://localhost:4200/`);
    }
  });
}
bootstrap();
