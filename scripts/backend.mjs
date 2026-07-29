import {spawn} from 'node:child_process';
import {existsSync} from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const backendDirectory = path.join(root, 'backend');
const bundledJavaHome = path.join(root, 'oracleJdk-26');
const javaHome = process.env.JAVA_HOME || (existsSync(bundledJavaHome) ? bundledJavaHome : '');
const javaExecutable = javaHome
  ? path.join(javaHome, 'bin', process.platform === 'win32' ? 'java.exe' : 'java')
  : 'java';

let child;
const run = (command, args, options = {}) => new Promise((resolve, reject) => {
  child = spawn(command, args, {
    cwd: backendDirectory,
    stdio: 'inherit',
    ...options,
  });
  child.on('error', reject);
  child.on('exit', code => code === 0 ? resolve() : reject(new Error(`Process exited with code ${code}`)));
});

process.on('SIGINT', () => child?.kill());
process.on('SIGTERM', () => child?.kill());

try {
  if (process.platform === 'win32') {
    await run(process.env.ComSpec ?? 'cmd.exe', ['/d', '/s', '/c', 'mvn package -DskipTests']);
  } else {
    await run('mvn', ['package', '-DskipTests']);
  }
  await run(javaExecutable, ['-jar', 'target/time-experience-0.0.1-SNAPSHOT.jar']);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
