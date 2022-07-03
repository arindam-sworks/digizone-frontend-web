import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { UserRepository } from '../repositories/users.repository';
import { Request, Response, NextFunction } from 'express';
import * as config from 'config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(UserRepository) private readonly userDB: UserRepository,
  ) {}
  use(req: Request | any, res: Response, next: NextFunction) {
    try {
      const authHeaders = req.headers.authorization;
      const token = (authHeaders as string).split(' ')[1];
      if (!authHeaders || !token) {
        throw new Error('Un authorized');
      }
      const decoded: any = jwt.verify(token, config.get('tokenSecret'));
      const user: any = this.userDB.getUserDetailsById(decoded.id);
      if (!user) {
        throw new Error('Un authorized');
      }
      user.password = undefined;
      req.user = user;
      next();
    } catch (error) {
      throw new Error('Un authorized');
    }
  }
}

@Injectable()
export class AdminMiddleware implements NestMiddleware {
  constructor(
    @Inject(UserRepository) private readonly userDB: UserRepository,
  ) {}
  use(req: Request | any, res: Response, next: NextFunction) {
    try {
      if (req.user.type === 'admin') {
        next();
      } else {
        throw new Error('Un authorized');
      }
    } catch (error) {
      throw new Error('Un authorized');
    }
  }
}

@Injectable()
export class CustomerMiddleware implements NestMiddleware {
  constructor(
    @Inject(UserRepository) private readonly userDB: UserRepository,
  ) {}
  use(req: Request | any, res: Response, next: NextFunction) {
    try {
      if (req.user.type === 'customer') {
        next();
      } else {
        throw new Error('Un authorized');
      }
    } catch (error) {
      throw new Error('Un authorized');
    }
  }
}
