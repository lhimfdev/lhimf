import { randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { promisify } from 'node:util';
import readline from 'node:readline';
import { stdin, stdout } from 'node:process';

const scrypt = promisify(scryptCallback);

function readHiddenPassword() {
  return new Promise((resolve, reject) => {
    if (!stdin.isTTY || typeof stdin.setRawMode !== 'function') {
      reject(new Error('Run this script directly in an interactive terminal.'));
      return;
    }
    let password = '';
    readline.emitKeypressEvents(stdin);
    stdin.setRawMode(true);
    stdin.resume();
    stdout.write('Enter a strong admin password (minimum 14 characters; input hidden): ');
    const cleanup = () => {
      stdin.off('keypress', onKeypress);
      stdin.setRawMode(false);
      stdin.pause();
      stdout.write('\n');
    };
    const onKeypress = (character, key = {}) => {
      if (key.ctrl && key.name === 'c') {
        cleanup();
        reject(new Error('Cancelled.'));
      } else if (key.name === 'return' || key.name === 'enter') {
        cleanup();
        resolve(password);
      } else if (key.name === 'backspace') {
        password = password.slice(0, -1);
      } else if (character && !key.ctrl && !key.meta) {
        password += character;
      }
    };
    stdin.on('keypress', onKeypress);
  });
}

try {
  const password = await readHiddenPassword();
  if (password.length < 14) {
    console.error('Use at least 14 characters.');
    process.exitCode = 1;
  } else {
    const salt = randomBytes(16);
    const hash = await scrypt(password, salt, 64);
    console.log('\nCopy this value into ADMIN_PASSWORD_HASH in your local .env.local and deployment environment:\n');
    console.log(`scrypt$${salt.toString('hex')}$${hash.toString('hex')}`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Could not create password hash.');
  process.exitCode = 1;
}
