import {spawn} from 'node:child_process';
import {parseArgs} from 'node:util';
import {fileURLToPath} from 'node:url';
import './build.mjs';

// Accept the preview runner's host/port flags while keeping local use dependency-free.
const {values} = parseArgs({options: {
  host: {type: 'string', default: '127.0.0.1'},
  port: {type: 'string', default: '3000'},
  strictPort: {type: 'boolean', default: false}
}});
const server = spawn('python3', ['-m', 'http.server', values.port, '--bind', values.host], {
  cwd: fileURLToPath(new URL('../', import.meta.url)),
  stdio: 'inherit'
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.kill(signal));
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.on('exit', code => { process.exitCode = code ?? 0; });
