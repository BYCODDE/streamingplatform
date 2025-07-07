import { type Request } from 'express';
import type { SessionMetadata } from '../types/session-metadata.types';

import DeviceDetector = require('device-detector-js');
import { IS_DEV_ENV } from './is-dev.utils';
import { lookup } from 'geoip-lite';
import * as countries from 'i18n-iso-countries';

countries.registerLocale(require('i18n-iso-countries/langs/en.json'));

export function getSessionMetadata(
  req: Request,
  userAgent: string,
): SessionMetadata {
  const ip = IS_DEV_ENV
    ? '173.166.164.121'
    : Array.isArray(req.headers['cf-connecting-ip'])
      ? req.headers['cf-connecting-ip'][0]
      : req.headers['cf-connecting-ip'] ||
        (typeof req.headers['x-forwarded-for'] === 'string'
          ? req.headers['x-forwarded-for'].split(',')[0]
          : req.ip);

  const location = lookup(ip!);
  const device = new DeviceDetector().parse(userAgent);

  if (!ip || !location || !device.client || !device.os || !device.device) {
    return {
      location: {
        country: 'Unknown',
        city: 'Unknown',
        latitude: 0,
        longitude: 0,
      },
      device: {
        type: 'Unknown',
        os: 'Unknown',
        browser: 'Unknown',
      },
      ip: 'Unknown',
    };
  }

  return {
    location: {
      country: countries.getName(location.country, 'en') || 'Unknown' ,
      city: location.city,
      latitude: location.ll[0],
      longitude: location.ll[1],
    },
    device: {
      browser: device.client.name,
      os: device.os.name,
      type: device.device.type,
    },
    ip,
  };
}
