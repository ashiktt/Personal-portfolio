import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';

function localDataSyncPlugin() {
  return {
    name: 'local-data-sync',
    configureServer(server: any) {
      server.middlewares.use('/api/save-initial-data', (req: any, res: any) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => (body += chunk));
          req.on('end', () => {
            try {
              const { profile, projects, certificates, tools, skillGroups } = JSON.parse(body);
              const filePath = path.resolve(process.cwd(), 'src/data/initialData.ts');

              // Format clean TypeScript file
              const fileContent = `import { SiteProfile, Project, Certificate, ToolItem, SkillGroup } from '../types';

export const INITIAL_PROFILE: SiteProfile = ${JSON.stringify(profile, null, 2)};

export const INITIAL_PROJECTS: Project[] = ${JSON.stringify(projects, null, 2)};

export const INITIAL_CERTIFICATES: Certificate[] = ${JSON.stringify(certificates, null, 2)};

export const INITIAL_TOOLS: ToolItem[] = ${JSON.stringify(tools, null, 2)};

export const INITIAL_SKILL_GROUPS: SkillGroup[] = ${JSON.stringify(skillGroups, null, 2)};

export const TOOLS_LIST = INITIAL_TOOLS;
export const DESIGN_SKILLS = INITIAL_SKILL_GROUPS;
`;

              fs.writeFileSync(filePath, fileContent, 'utf-8');
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, message: 'Saved to initialData.ts successfully!' }));
            } catch (err: any) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: false, error: err?.message || 'Failed to save' }));
            }
          });
        } else {
          res.writeHead(405);
          res.end();
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    localDataSyncPlugin(),
  ],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) {
              return 'motion';
            }
            if (id.includes('react')) {
              return 'vendor-react';
            }
            return 'vendor';
          }
        },
      },
    },
  },
});
