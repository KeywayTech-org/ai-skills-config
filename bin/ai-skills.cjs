#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const home = os.homedir();
const packageRoot = path.resolve(__dirname, '..');
const managedRoot = path.join(home, '.keywaytech', 'ai-skills');
const activeRoot = dryRun ? packageRoot : managedRoot;
const sources = ['code', 'work', 'find-skills'];
const known = ['.codex', '.claude', '.trae-cn', '.trae', '.gemini', '.kimi', '.qwen', '.cursor', '.windsurf'];

function say(message) { console.log(message); }
function fail(message) { console.error(`错误：${message}`); }
function exists(p) { return fs.existsSync(p); }
function isDir(p) { try { return fs.statSync(p).isDirectory(); } catch { return false; } }
function hashFile(p) { return crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'); }
function skillHash(dir) {
  const manifest = path.join(dir, 'SKILL.md');
  return exists(manifest) ? hashFile(manifest) : null;
}
function copySource() {
  if (dryRun) return say(`预演：将同步 skills 到 ${managedRoot}`);
  fs.mkdirSync(managedRoot, { recursive: true });
  for (const name of sources) {
    const from = path.join(packageRoot, name);
    const to = path.join(managedRoot, name);
    if (!exists(from)) continue;
    fs.cpSync(from, to, { recursive: true, force: true, dereference: true });
  }
}
function discoverTargets() {
  const targets = new Set();
  for (const name of known) {
    const parent = path.join(home, name);
    const skills = path.join(parent, 'skills');
    if (isDir(parent) || isDir(skills)) targets.add(skills);
  }
  for (const entry of fs.readdirSync(home, { withFileTypes: true })) {
    if (!entry.isDirectory() || !entry.name.startsWith('.')) continue;
    const skills = path.join(home, entry.name, 'skills');
    if (isDir(skills)) targets.add(skills);
  }
  return [...targets];
}
function collectSkills() {
  const result = [];
  for (const group of ['code', 'work']) {
    const dir = path.join(activeRoot, group);
    if (!isDir(dir)) continue;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) if (entry.isDirectory()) result.push(path.join(dir, entry.name));
  }
  const rootSkill = path.join(activeRoot, 'find-skills');
  if (isDir(rootSkill)) result.push(rootSkill);
  return result;
}
function sameLink(link, source) {
  try { return fs.realpathSync(link).toLowerCase() === fs.realpathSync(source).toLowerCase(); } catch { return false; }
}
function deploy(target, skills) {
  const label = target.replace(home, '~');
  if (!exists(target)) {
    if (dryRun) say(`预演：将创建 ${label}`); else fs.mkdirSync(target, { recursive: true });
  }
  let linked = 0, skipped = 0, conflicts = 0;
  for (const source of skills) {
    const destination = path.join(target, path.basename(source));
    if (exists(destination)) {
      if (sameLink(destination, source) || skillHash(destination) === skillHash(source)) { skipped++; continue; }
      conflicts++; fail(`${label} 中的 ${path.basename(source)} 与待安装版本不同，未覆盖。`); continue;
    }
    if (dryRun) { linked++; continue; }
    try { fs.symlinkSync(source, destination, process.platform === 'win32' ? 'junction' : 'dir'); linked++; }
    catch (error) { fail(`无法在 ${label} 安装 ${path.basename(source)}：${error.message}`); }
  }
  say(`${label}：新建联接 ${linked}，跳过 ${skipped}，冲突 ${conflicts}。`);
}
function main() {
  if (args.has('--help')) return say('用法：npx -y @keywaytech/ai-skills [--dry-run]\n--dry-run 仅显示将执行的操作，不写入文件。');
  if (!exists(path.join(packageRoot, 'README.md'))) return fail('安装包不完整：未找到 README.md。');
  copySource();
  const skills = collectSkills();
  const targets = discoverTargets();
  if (!targets.length) return fail('未检测到已安装的 Agent 或 IDE skills 目录。请先安装 Codex、Claude Code、Trae、Gemini、Kimi 等工具后重试。');
  say(`检测到 ${targets.length} 个 skills 目录，准备部署 ${skills.length} 个 skill${dryRun ? '（预演）' : ''}。`);
  for (const target of targets) deploy(target, skills);
}
try { main(); } catch (error) { fail(error.message); process.exitCode = 1; }
