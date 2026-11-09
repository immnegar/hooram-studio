import fs from 'fs';
import { config } from './config.js';

export const logger = {
  log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const formattedData = data ? (typeof data === 'string' ? data : JSON.stringify(data)) : '';
    const logLine = `[${timestamp}] [${level.toUpperCase()}] ${message} ${formattedData}`.trim();

    // Console output with color-friendly indicators
    const prefix = level === 'ERROR' ? '❌' : level === 'WARN' ? '⚠️' : level === 'SUCCESS' ? '✅' : 'ℹ️';
    console.log(`${prefix} ${logLine}`);

    // Append to file safely
    try {
      fs.appendFileSync(config.logFile, logLine + '\n', 'utf-8');
    } catch (err) {
      console.error('Failed to write to backup log file:', err.message);
    }
  },

  info(msg, data) {
    this.log('INFO', msg, data);
  },

  success(msg, data) {
    this.log('SUCCESS', msg, data);
  },

  warn(msg, data) {
    this.log('WARN', msg, data);
  },

  error(msg, data) {
    this.log('ERROR', msg, data);
  }
};

