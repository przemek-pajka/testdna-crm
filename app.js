// app.js  — wrapper dla Passenger‑a
const { spawn } = require('child_process');

// args: next start -H 0.0.0.0 -p $PORT
const child = spawn(
  process.execPath,
  [require.resolve('next/dist/bin/next'), 'start', '-H', '0.0.0.0', '-p', process.env.PORT],
  { stdio: 'inherit', env: process.env }
);

child.on('close', (code) => {
  console.log(`Next.js exited with code ${code}`);
});
