const Generator = require('yeoman-generator');

class App extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  prompting() {
    const author = this.user.git.name();

    return this.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Your project name',
        default: this.appname,
      },
      {
        type: 'input',
        name: 'author',
        message: 'Author to be listed in package.json',
        default: author,
      },
    ]).then((answers) => {
      this.log('project name', answers.projectName);
      this.options.projectName = answers.projectName;
      this.log('author', answers.author);
      this.options.author = answers.author;
    });
  }

  writing() {
    const vars = {
      projectName: this.options.projectName,
      author: this.options.author,
    };

    const files = [
      '.npmignore',
      '.gitignore',
      'index.ts',
      'index.test.ts',
      'jest.config.js',
      'package.json',
      'prettier.config.js',
      'README.md',
      'tests.js',
      'tsconfig.json',
      'tslint.json',
    ];

    files.forEach((file) => {
      this.fs.copyTpl(
        this.templatePath(file),
        this.destinationPath(file),
        vars,
      );
    });

    const pkgJson = {
      dependencies: {},
    };

    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
  }

  install() {
    this.yarnInstall();
  }
}

module.exports = App;
