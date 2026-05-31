import chalk from 'chalk';

const levels = {
  info: chalk.cyan,
  success: chalk.green,
  warn: chalk.yellow,
  error: chalk.red,
  bot: chalk.magenta,
};

function timestamp() {
  return new Date().toLocaleTimeString('fr-FR');
}

export const logger = {
  info: (msg) => console.log(`${chalk.gray(`[${timestamp()}]`)} ${levels.info('ℹ')} ${msg}`),
  success: (msg) => console.log(`${chalk.gray(`[${timestamp()}]`)} ${levels.success('✓')} ${msg}`),
  warn: (msg) => console.log(`${chalk.gray(`[${timestamp()}]`)} ${levels.warn('⚠')} ${msg}`),
  error: (msg) => console.log(`${chalk.gray(`[${timestamp()}]`)} ${levels.error('✗')} ${msg}`),
  bot: (msg) => console.log(`${chalk.gray(`[${timestamp()}]`)} ${levels.bot('🔥')} ${msg}`),
  cmd: (user, cmd) => console.log(`${chalk.gray(`[${timestamp()}]`)} ${chalk.blue('CMD')} ${chalk.white(user)} → ${chalk.yellow(cmd)}`),
};
