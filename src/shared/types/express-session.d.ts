import 'express-session';
import { SessionMetadata } from './session-metadata.types';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
    createdAt?: Date | string;
    metadata?: SessionMetadata;
  }
}

// declare module 'express' {
//   interface Request {
//     session: import('express-session').Session &
//       Partial<import('express-session').SessionData>;
//   }
// }
