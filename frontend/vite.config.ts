import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  // Load environment variables based on the mode
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      port: Number(env.VITE_DEV_PORT) || 3000,
    },
  };
});

