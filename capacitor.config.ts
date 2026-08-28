import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.bookflow.reader',
  appName: 'BookFlow',
  webDir: 'out',
  android: {
    allowMixedContent: false,
    captureInput: false,
  },
  server: {
    androidScheme: 'https',
  },
};

export default config;