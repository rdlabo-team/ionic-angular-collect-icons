import { describe, expect, it } from "vitest";

import {
  getAngularNgModuleDecorator,
  getAngularComponentDecorator,
  isAngularComponentClass,
  isAngularComponentStandalone,
} from "./angular-utils";
import { Project } from "ts-morph";

import { dedent } from "ts-dedent";
import {getOptionsFromArgv, getRelativePath} from './cli-utils';

describe("getRelativePath", () => {
  it("should return relative path", () => {
    const path = getRelativePath('/Users/sakakibara/dev/ionic-angular-collect-icons/src/app/example.ts', '/Users/sakakibara/dev/ionic-angular-collect-icons/use-icons.ts');
    expect(path).toStrictEqual('../../use-icons.ts');
  });
});

describe("getOptionsFromArgv", () => {
  it("should return object options", () => {
    const sourceArgv = ['--dry-run', 'true', '--interactive'];

    expect(getOptionsFromArgv(sourceArgv)).toStrictEqual({
      dryRun: true,
      interactive: true,
    });
  });
});

describe("getAngularComponentDecorator", () => {
  it("should return the Component decorator", () => {
    const sourceFileContent = `
      import { Component } from '@angular/core';

      @Component({
        selector: 'my-component',
        template: ''
      })
      export class MyComponent {}
    `;

    const project = new Project({ useInMemoryFileSystem: true });
    const sourceFile = project.createSourceFile("foo.ts", sourceFileContent);

    const actual = getAngularComponentDecorator(sourceFile);

    expect(dedent(actual?.getText()!)).toBe(
      dedent(`
    @Component({
      selector: 'my-component',
      template: ''
    })
    `),
    );
  });
});

describe("isAngularComponentClass", () => {
  it("should return true if the class is an Angular component", () => {
    const sourceFileContent = `
    import { Component } from '@angular/core';

    @Component({
      selector: 'my-component',
      template: ''
    })
    export class MyComponent {}
  `;

    const project = new Project({ useInMemoryFileSystem: true });
    const sourceFile = project.createSourceFile("foo.ts", sourceFileContent);

    expect(isAngularComponentClass(sourceFile)).toBe(true);
  });

  it("should return false if the class does not have a component decorator", () => {
    const sourceFileContent = `
    import { Injectable } from '@angular/core';

    @Injectable()
    export class MyService {}
  `;

    const project = new Project({ useInMemoryFileSystem: true });
    const sourceFile = project.createSourceFile("foo.ts", sourceFileContent);

    expect(isAngularComponentClass(sourceFile)).toBe(false);
  });

  it("should return false if the @Component decorator is not from @angular/core", () => {
    const sourceFileContent = `
    import { Component } from '@myapp';

    @Component({
      selector: 'my-component',
      template: ''
    })
    export class MyComponent {}
  `;

    const project = new Project({ useInMemoryFileSystem: true });
    const sourceFile = project.createSourceFile("foo.ts", sourceFileContent);

    expect(isAngularComponentClass(sourceFile)).toBe(false);
  });
});

describe("isAngularComponentStandalone", () => {
  it("should return true if the component has standalone: true", () => {
    const sourceFileContent = `
    import { Component } from '@angular/core';

    @Component({
      selector: 'my-component',
      template: '',
      standalone: true
    })
    export class MyComponent {}
  `;

    const project = new Project({ useInMemoryFileSystem: true });
    const sourceFile = project.createSourceFile("foo.ts", sourceFileContent);

    expect(isAngularComponentStandalone(sourceFile)).toBe(true);
  });

  it("should return false if the component has standalone: false", () => {
    const sourceFileContent = `
    import { Component } from '@angular/core';

    @Component({
      selector: 'my-component',
      template: '',
      standalone: false
    })
    export class MyComponent {}
  `;

    const project = new Project({ useInMemoryFileSystem: true });
    const sourceFile = project.createSourceFile("foo.ts", sourceFileContent);

    expect(isAngularComponentStandalone(sourceFile)).toBe(false);
  });

  it("should return false if the component does not have the standalone flag", () => {
    const sourceFileContent = `
    import { Component } from '@angular/core';

    @Component({
      selector: 'my-component',
      template: ''
    })
    export class MyComponent {}
  `;

    const project = new Project({ useInMemoryFileSystem: true });
    const sourceFile = project.createSourceFile("foo.ts", sourceFileContent);

    expect(isAngularComponentStandalone(sourceFile)).toBe(false);
  });
});
