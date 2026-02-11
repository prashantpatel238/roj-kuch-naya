const requiredEnvVars = ['MONGODB_URI', 'MONGODB_DB'] as const;

type EnvVar = (typeof requiredEnvVars)[number];

function assertEnvVar(name: EnvVar): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  MONGODB_URI: assertEnvVar('MONGODB_URI'),
  MONGODB_DB: assertEnvVar('MONGODB_DB')
};
