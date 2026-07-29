import {spawn} from 'node:child_process';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const backend = spawn(process.execPath, ['scripts/backend.mjs'], {
  cwd: root,
  stdio: 'inherit',
});

const frontend = process.platform === 'win32'
  ? spawn(process.env.ComSpec ?? 'cmd.exe', ['/d', '/s', '/c', 'npm run dev'], {
      cwd: root,
      stdio: 'inherit',
    })
  : spawn('npm', ['run', 'dev'], {
      cwd: root,
      stdio: 'inherit',
    });

let shuttingDown = false;
function shutdown(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  backend.kill();
  frontend.kill();
  setTimeout(() => process.exit(exitCode), 250);
}

backend.on('exit', code => {
  if (!shuttingDown && code !== 0) shutdown(code ?? 1);
});
frontend.on('exit', code => {
  if (!shuttingDown && code !== 0) shutdown(code ?? 1);
});
process.on('SIGINT', () => shutdown());
process.on('SIGTERM', () => shutdown());
