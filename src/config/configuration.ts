import { envSchema } from './env.schema.js';

export default () => {
  const env = envSchema.parse(process.env);

  return {
    app: {
      port: env.PORT,
    },
    db: {
      url: env.DATABASE_URL,
    },
  };
};
