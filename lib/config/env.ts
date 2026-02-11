type EnvVar = 'MONGODB_URI' | 'MONGODB_DB';

function readEnvVar(name: EnvVar): string | undefined {
  return process.env[name];
}

function assertEnvVar(name: EnvVar): string {
  const value = readEnvVar(name);

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const env = {
  get MONGODB_URI(): string {
    return assertEnvVar('MONGODB_URI');
  },
  get MONGODB_DB(): string {
    return readEnvVar('MONGODB_DB') || 'roj-kuch-naya';
  }
};
