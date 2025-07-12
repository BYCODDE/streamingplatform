import { User } from 'generated/prisma';
import { SessionMetadata } from '../types/session-metadata.types';
import type { Request } from 'express';
import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const saveSession = async (
  req: Request,
  user: User,
  sessionMetadata: SessionMetadata,
) => {
  return new Promise((resolve, reject) => {
    req.session.createdAt = new Date().toISOString();
    req.session.userId = user.id;
    req.session.metadata = sessionMetadata;
    req.session.save((err) => {
      if (err) {
        return reject(
          new InternalServerErrorException(
            'cannot save session,please try again later',
          ),
        );
      }

      resolve(user);
    });
  });
};


export const destroySession = async (req: Request,config: ConfigService) => {
 return new Promise((resolve, reject) => {
   req.session.destroy((err) => {
     if (err) {
       return reject(
         new InternalServerErrorException(
           'cannot destroy session, please try again later',
         ),
       );
     }

     req.res?.clearCookie(
       config.getOrThrow<string>('SESSION_NAME'),
     );
     resolve(true);
   });
 });

}