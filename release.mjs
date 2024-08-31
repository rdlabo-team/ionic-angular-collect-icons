import { updatePackage } from 'write-pkg';
import path from 'path';
import pkg from './package.json' with { type: 'json' };
import { exec } from 'child_process';

const workspaces = ['cli'];

workspaces.forEach(async (workspace) => {
  const buildPackagePath = path.resolve('./packages/' + workspace);
  await updatePackage(buildPackagePath + '/package.json', { version: pkg.version });
  exec(
    `cd ${buildPackagePath} && npm publish --access public`,
    (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log(stdout);
    },
  );
});
