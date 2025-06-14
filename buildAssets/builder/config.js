/* eslint-disable no-template-curly-in-string */
const dotenv = require('dotenv')

const baseConfig = {
  productName: 'AART',
  appId: 'za.co.adsolutions.aart',
  asar: true,
  extends: null,
  compression: 'maximum',
  artifactName: '${productName}-${version}-${arch}.${ext}',
  directories: {
    output: './release/${version}'
  },
  mac: {
    bundleVersion: '1.0',
    identity: 'Actuaries and Digital Solutions (Pty) Ltd',
    hardenedRuntime: true,
    gatekeeperAssess: false,
    notarize: false,
    icon: 'buildAssets/icons/icon.icns',
    type: 'distribution',
    target: [
      {
        target: 'dmg',
        arch: ['arm64']
      },
      {
        target: 'zip',
        arch: ['arm64']
      }
      // {
      //   target: 'dmg',
      //   arch: ['x64', 'arm64', 'universal']
      // },
      // {
      //   target: 'zip',
      //   arch: ['x64', 'arm64', 'universal']
      // }
    ]
  },
  dmg: {
    contents: [
      {
        x: 410,
        y: 150,
        type: 'link',
        path: '/Applications'
      },
      {
        x: 130,
        y: 150,
        type: 'file'
      }
    ],
    sign: true
  },
  win: {
    icon: 'buildAssets/icons/icon.ico',
    // certificateSubjectName: 'Actuaries and Digital Solutions (Pty) Ltd',
    target: [
      // {
      //   target: 'appx',
      //   arch: 'x64'
      // },
      // {
      //   target: 'zip',
      //   arch: 'x64'
      // },
      // {
      //   target: 'portable',
      //   arch: 'x64'
      // },
      {
        target: 'nsis',
        arch: 'x64'
      }
    ]
  },
  portable: {
    artifactName: '${productName} ${version}_${arch} Portable.${ext}'
  },
  nsis: {
    oneClick: true
  }
}

dotenv.config()

baseConfig.copyright = `ⓒ ${new Date().getFullYear()} $\{author}`
baseConfig.files = [
  /* A list of files not to be included in the build. */
  /*
    (Required) The files and folders listed below should not be included in the build.
  */
  'dist/**/*',
  '!dist/main/index.dev.js',
  '!docs/**/*',
  '!tests/**/*',
  '!release/**/*'
]

// TODO: Notarize for macOS
// baseConfig.mac.identity = 'Onajome Akpoduado (KYR2TJ3Z3M)'
// if (process.env.MAC_NOTARIZE === 'true') {
//   baseConfig.afterSign = './buildAssets/builder/notarize.ts'
// } else {
//   baseConfig.mac.identity = null
// }

module.exports = {
  ...baseConfig
}
