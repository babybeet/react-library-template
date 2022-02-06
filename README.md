This repository contains a complete scaffold that allows you to get started creating your React libraries with ease, below is the list of features:

- [TypeScript](https://www.typescriptlang.org/) support
- [SASS](https://sass-lang.com/) support
- Code is linted by [ESlint](https://eslint.org/)
- Component testing with [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Webpack](https://webpack.js.org/) support
- [Husky](https://typicode.github.io/husky/#/) support
- Staged changes are linted with [lint-staged](https://github.com/okonet/lint-staged) before being committed to Git's history

<br/>

# How to use
## Development
To develop your library code, just add it to **lib/src**, inside your React source files, you can import your SASS files and Webpack will take care of the rest for you.

Be sure to add anything that you'd like to export to **lib/src/index.ts**, or else, nothing can be imported from your library.

Your style files should end with **.scss**. If you'd like to create dark and light theme styles for your component, then your SASS files should end with **.light.scss** for light theme styles and **.dark.scss** for dark theme styles, if there are some global CSS that you'd like to import into these theme-specific files, you can add them to the SASS files inside **lib/resources/scss** folder. Be sure to import both light and dark theme style files in the same component (You can view an example of this [here](https://github.com/nhuyvan/react-dialog-builder/tree/master/lib/src/dialog))

## Testing
Add your test files next to the source files of the components that you want to test, I chose this pattern instead of placing all of the test files inside a separate folder called **\_\_tests\_\_** because it is easier to see which components already have a corresponding test file. Your test files should end with **.test.tsx** (Or **.test.ts** for non-JSX code) for Jest to pick up.

Execute `npm test` to run all of your unit tests or `npm test -- --watch` to run all of your tests in watch mode. If you need to run a specific test file, pass its name like this `npm test -- Toast` assuming that there exists a test file named **Toast.test.ts** (`npm test -- toast` also works thanks to Jest's case-insensitive name check).

## Building and publishing
Before you publish your library, you should update your README file and choose an appropriate software license. Anything added to **README.md** file will be copied to the final distribution inside **lib/dist** to be published to the npm registry, additionally, the **LICENSE** file and **lib/package.json** file will also be copied to **lib/dist**, so make sure you configure your **lib/package.json** accordingly.

Execute `npm run build` to build your source code. Once you are ready to publish, you can execute `npm run publish` to upload your library code to the npm registry (Be sure to `npm login` before publishing)

## Manual test
You should perform a manual check of your library locally to be sure that everything works as expected, to do that, you can update the `library-name` string inside **visual-test/package.json** file to the name of your library. Be sure to `npm install` inside **visual-test** folder so that the symlink to your library is updated, assuming that you've already built your library code inside **lib** folder.

After `npm install` inside **visual-test** folder, you can start using your local library code as if it were a third-party package, in other words, your import statement should look like this

`import { Something } from 'library-name';`

instead of

`import { Something } from '../../../lib/src/;`

Since **visual-test** is just a regular React app, you can start its development server or do anything else as you would in your regular app development settings.