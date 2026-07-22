import dotenv from 'dotenv';

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://leptron:leptron_secure_password_2024@localhost:5432/leptron_hospitality_os',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  jwt: {
    secret: process.env.JWT_SECRET || 'leptron_jwt_secret_key_enterprise_grade_2024_change_in_production',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'leptron_refresh_secret_key_enterprise_grade_2024_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    from: process.env.EMAIL_FROM || 'noreply@leptron.com',
  },
  mfa: {
    issuer: process.env.MFA_ISSUER || 'Leptron HospitalityOS',
  },
  session: {
    maxAge: parseInt(process.env.SESSION_MAX_AGE || '604800000', 10), // 7 days
  },
  passwordPolicy: {
    minLength: parseInt(process.env.PASSWORD_MIN_LENGTH || '8', 10),
    requireUppercase: process.env.PASSWORD_REQUIRE_UPPERCASE !== 'false',
    requireLowercase: process.env.PASSWORD_REQUIRE_LOWERCASE !== 'false',
    requireNumbers: process.env.PASSWORD_REQUIRE_NUMBERS !== 'false',
    requireSpecialChars: process.env.PASSWORD_REQUIRE_SPECIAL !== 'false',
    maxAge: parseInt(process.env.PASSWORD_MAX_AGE_DAYS || '90', 10),
    historyCount: parseInt(process.env.PASSWORD_HISTORY_COUNT || '5', 10),
  },
  lockout: {
    maxAttempts: parseInt(process.env.LOCKOUT_MAX_ATTEMPTS || '5', 10),
    duration: parseInt(process.env.LOCKOUT_DURATION_MINUTES || '30', 10),
  },
};

export type Config = typeof config;
