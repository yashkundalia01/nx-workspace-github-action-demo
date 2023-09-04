const { readJsonSync, writeJsonSync } = require('fs-extra');
const path = require('path');
const lodash = require('lodash');
const execSync = require('child_process').execSync;

const log = (message) => console.log(message);

const exec = (command) => {
  log(`executing command: ${command}`);
  return execSync(command, { encoding: 'utf8' }).trim();
};

const LERNA_BIN = path.join(exec('npm bin'), 'lerna');
const lerna = (args) => {
  log(`executing lerna command: ${LERNA_BIN} ${args}`);
  return exec(`${LERNA_BIN} ${args}`);
};

const getManagedPackages = () => lerna('ls').split('\n');
const getPackageNameWithoutScope = (pkg) =>
  pkg.substring(pkg.lastIndexOf(path.sep) + 1);

(function updatePeerDependencies() {
  const managedPkgs = getManagedPackages();
  const pkgFolderNames = lodash.map(managedPkgs, (pkg) =>
    getPackageNameWithoutScope(pkg)
  );
  const managedPkgsAndContent = lodash.reduce(
    pkgFolderNames,
    (pkgs, pkg) => ({
      ...pkgs,
      [pkg]: readJsonSync(
        path.resolve(__dirname, '..', 'libs', pkg, 'package.json')
      ),
    }),
    {}
  );

  managedPkgs.forEach((pkg) => {
    const pkgName = getPackageNameWithoutScope(pkg);
    const pkgJsonContent = managedPkgsAndContent[pkgName];
    const peerDependencies = lodash.intersection(
      lodash.keys(pkgJsonContent.peerDependencies),
      managedPkgs
    );
    lodash.forEach(peerDependencies, (peerDep) => {
      const peerDepPkgName = getPackageNameWithoutScope(peerDep);
      managedPkgsAndContent[pkgName] = {
        ...managedPkgsAndContent[pkgName],
        peerDependencies: {
          ...managedPkgsAndContent[pkgName].peerDependencies,
          [peerDep]: managedPkgsAndContent[peerDepPkgName].version,
        },
      };
    });
  });

  lodash.forEach(pkgFolderNames, (pkg) => {
    writeJsonSync(
      path.resolve(__dirname, '..', 'libs', pkg, 'package.json'),
      managedPkgsAndContent[pkg],
      { spaces: 2 }
    );
  });
})();
