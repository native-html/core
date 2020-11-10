module.exports = function (name) {
  const template = name + '@${version}';
  return {
    git: {
      commitMessage: 'chore: release ' + template,
      tagName: template
    },
    npm: {
      publish: true
    },
    github: {
      release: true,
      releaseName: template
    },
    plugins: {
      '@release-it/conventional-changelog': {
        preset: 'angular',
        infile: 'CHANGELOG.md'
      }
    }
  };
};
