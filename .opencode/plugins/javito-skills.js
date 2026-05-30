import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Plugin lives at .opencode/plugins/javito-skills.js
// Repo root is two directories up
const skillsDir = path.resolve(__dirname, '../..');

export const JavavitoSkillsPlugin = async ({ client, directory }) => {
  return {
    config: async (config) => {
      config.skills = config.skills || {};
      config.skills.paths = config.skills.paths || [];
      if (!config.skills.paths.includes(skillsDir)) {
        config.skills.paths.push(skillsDir);
      }
    }
  };
};

export default JavavitoSkillsPlugin;
