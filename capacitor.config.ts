import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lunarossa.tempicottura',
  appName: 'TempiCottura',
  webDir: '.',
  bundledWebRuntime: false,
  server: { androidScheme: 'https' }
};
export default config;
