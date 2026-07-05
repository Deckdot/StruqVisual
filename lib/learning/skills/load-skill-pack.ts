import fs from 'fs';
import path from 'path';
import { CONTENT_LEARN_SKILLS_DIR } from '../constants';

export interface SkillPack {
  name: string;
  skill: string;
  template: string;
}

function getSkillsDirectory(): string {
  // turbopackIgnore suppresses NFT from tracing the entire project root
  return path.join(/*turbopackIgnore: true*/ process.cwd(), CONTENT_LEARN_SKILLS_DIR);
}

export function loadSkillPack(skillName: string): SkillPack | null {
  const skillDir = path.join(getSkillsDirectory(), skillName);

  if (!fs.existsSync(skillDir)) {
    return null;
  }

  const skillPath = path.join(skillDir, 'SKILL.md');
  const templatePath = path.join(skillDir, 'template.md');

  const skill = fs.existsSync(skillPath) ? fs.readFileSync(skillPath, 'utf8') : '';
  const template = fs.existsSync(templatePath) ? fs.readFileSync(templatePath, 'utf8') : '';

  return { name: skillName, skill, template };
}

export function loadAllSkillPacks(): SkillPack[] {
  const skillsDirectory = getSkillsDirectory();
  if (!fs.existsSync(skillsDirectory)) return [];

  const entries = fs.readdirSync(skillsDirectory, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory());

  return dirs
    .map((d) => loadSkillPack(d.name))
    .filter((s): s is SkillPack => s !== null);
}

export function buildSkillContext(packs: SkillPack[]): string {
  if (packs.length === 0) return '';

  return packs
    .map((p) => `## Skill: ${p.name}\n\n${p.skill}\n\n### Template\n\n${p.template}`)
    .join('\n\n---\n\n');
}
