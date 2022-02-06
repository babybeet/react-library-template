/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const nodeExternals = require('webpack-node-externals');
const RemovePlugin = require('remove-files-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  devtool: 'source-map',

  entry: makeEntries(),

  experiments: {
    outputModule: true
  },

  externals: [
    nodeExternals()
  ],

  mode: 'production',

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /(\.tsx?)$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                [
                  'babel-plugin-jsx-remove-data-test-id',
                  {
                    attributes: ['data-testid', 'data-test-id', 'data-test']
                  }
                ]
              ]
            }
          },
          'ts-loader'
        ]
      }
    ]
  },

  output: {
    filename: '[name].js',
    clean: true,
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: 'module'
    }
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        path.resolve(__dirname, 'package.json'),
        path.resolve(__dirname, '..', 'README.md'),
        path.resolve(__dirname, '..', 'LICENSE'),
        {
          from: path.resolve(__dirname, '..', 'docs'),
          to: 'docs'
        }
      ]
    }),
    new RemovePlugin({
      after: {
        test: [
          {
            folder: 'dist',
            method: (absoluteItemPath) => {
              if (absoluteItemPath.includes('node_modules')) {
                return false;
              }
              const filesToDelete = [
                /dark\.js(?:\.map)?$/,
                /light\.js(?:\.map)?$/,
                /index\.css(?:\.map)?$/,
                /test.*\.ts?$/
              ];
              return filesToDelete.some(pattern => pattern.test(absoluteItemPath));
            },
            recursive: true
          }
        ]
      }
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],

  resolve: {
    alias: {
      '@constants.common': path.resolve('./resources/scss/constants.common.scss'),
      '@constants.light': path.resolve('./resources/scss/constants.light.scss'),
      '@constants.dark': path.resolve('./resources/scss/constants.dark.scss')
    },
    extensions: ['.ts', '.tsx', '.scss'],
    symlinks: false
  },

  stats: 'errors-warnings'
};

function makeEntries() {
  const entries = {
    index: path.resolve(__dirname, 'src', 'index.ts')
  };

  const lightThemeSassFiles = gatherSassFilesForTheme('light', path.resolve(__dirname, 'src'));
  if (lightThemeSassFiles.length > 0) {
    entries.light = lightThemeSassFiles;
  }

  const darkThemeSassFiles = gatherSassFilesForTheme('dark', path.resolve(__dirname, 'src'));
  if (darkThemeSassFiles.length > 0) {
    entries.dark = darkThemeSassFiles;
  }

  return entries;
}

/**
 *
 * @param {'light' | 'dark'} theme
 * @param {string} parentPath
 * @param {string[]} gatheredFiles
 * @returns
 */
function gatherSassFilesForTheme(theme, parentPath, gatheredFiles = []) {
  const entries = fs.readdirSync(parentPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPathToEntry = path.resolve(parentPath, entry.name);

    if (entry.name.endsWith(`${theme}.scss`)) {
      gatheredFiles.push(fullPathToEntry);
    } else if (entry.isDirectory()) {
      if (!isInsideSrcOrResourcesDirectory(fullPathToEntry)) {
        continue;
      }
      gatherSassFilesForTheme(theme, fullPathToEntry, gatheredFiles);
    }
  }
  return gatheredFiles;
}

/**
 *
 * @param {string} fullPathToEntry
 * @returns
 */
function isInsideSrcOrResourcesDirectory(fullPathToEntry) {
  return /[/\\](?:src|resources)/.test(fullPathToEntry);
}
