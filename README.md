# @theintern/angular-plugin

A plugin to set up the Angular testbed for use with Intern

## Installation

`@theintern/angular-plugin` should be installed as a peer of `intern`:

```sh
npm install intern@next @theintern/angular-plugin
```

## Usage

To use `@theintern/angular-plugin`, simply add it to the `plugins` array of `intern.json`:

```json
{
  "browser": {
    ...

    "plugins": [
      "@theintern/angular-plugin"
    ],

    ...
  }
}
```

The plugin does the following:

* Ensures Zone.js is loaded with long stack trace support
* Initializes Angular's `TestBed` for use in the browser
* Resets the testing module of Angular's `TestBed` after each test

If a browser shim or other Zone.js patches are required, add them as plugins before and after `@theintern/angular-plugin`:

```json
{
  "browser": {
    ...

    "plugins": [
      "core-js/client/shim.js",
      "@theintern/angular-plugin",
      "zone.js/dist/proxy.js",
      "zone.js/dist/sync-test.js",
      "zone.js/dist/async-test.js",
      "zone.js/dist/fake-async-test.js"
    ],

    ...
  }
}
```

*NOTE: Because of Intern's native support of asynchronous tests (and TypeScript's downlevel emit for async/await), there should be no need for the fake async patches to Zone.js.*

## Writing unit tests

Writing unit tests for Angular in Intern should look similar to writing unit tests for Angular in Karma, with one notable exception: there is no need for the fake async wrappers and async/await should be used instead:

```ts
const { describe, it, beforeEach } = intern.getInterface('bdd');
const { expect } = intern.getPlugin('chai');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
    let comp: MyComponent;
    let fixture: ComponentFixture<MyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                ...
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(MyComponent);
        comp = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('is instantiated', () => {
        expect(comp).not.to.be.null;
    });
});
```
