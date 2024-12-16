import { ipcMain, shell, IpcMainEvent, BrowserWindow, app } from 'electron'
import Constants from './utils/Constants'
import Store from 'electron-store'
import _ from 'lodash'
import { encrypt, decrypt } from './utils/encryption'
import { machine } from 'node-unique-machine-id'
import axios from 'axios'
const { autoUpdater } = require('electron-updater')

// import { generateMachineFingerprint } from './utils/fingerprint'
const store = new Store()
const { snakeCase } = _

const toSnakeCaseKeys = (obj) => {
  if (typeof obj !== 'object' || obj === null) return obj
  if (Array.isArray(obj)) return obj.map(toSnakeCaseKeys)
  return Object.keys(obj).reduce((result, key) => {
    result[snakeCase(key)] = toSnakeCaseKeys(obj[key])
    return result
  }, {})
}

const decode = (token) => {
  const decodedString = decodeURIComponent(
    atob(token.split('.')[1].replace('-', '+').replace('_', '/'))
      .split('')
      .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
      .join('')
  )

  const decodedObject = JSON.parse(decodedString)

  return toSnakeCaseKeys(decodedObject)
}

/*
 * IPC Communications
 * */
export default class IPCs {
  static initialize(): void {
    // Get application version
    ipcMain.on('msgGetAppVersion', (event: IpcMainEvent) => {
      event.returnValue = Constants.APP_VERSION
    })

    // Open url via web browser
    ipcMain.on('msgOpenExternalLink', async (event: IpcMainEvent, url: string) => {
      await shell.openExternal(url)
    })

    // check if the application has been activated
    ipcMain.on('msgGetAppStatus', (event: IpcMainEvent) => {
      event.returnValue = store.get('activated', false)
    })

    // check if an authenticated user exists
    ipcMain.on('msgGetAuthenticatedUser', (event: IpcMainEvent) => {
      event.returnValue = store.get('authenticatedUser', null)
    })

    // store authenticated user by decoding the passed token. If the token is invalid or null, then remove the authenticated user
    ipcMain.on('msgStoreAuthenticatedUser', (event: IpcMainEvent, token: string) => {
      try {
        if (!token) {
          store.delete('authenticatedUser')
          event.returnValue = null
          return
        }
        const decodedJWT = decode(token)
        const authenticatedUser = decodedJWT.user

        store.set('authenticatedUser', authenticatedUser)
        const hashedProfile = encrypt(JSON.stringify(decodedJWT.user))
        store.set('user_profile', hashedProfile)
        store.set('access_token', token)
        event.returnValue = authenticatedUser
      } catch (e) {
        store.delete('authenticatedUser')
        store.delete('user_profile')
        store.delete('access_token')
        event.returnValue = null
      }
    })

    // restart the application
    ipcMain.on('msgRestartApplication', (event: IpcMainEvent, updateIndicator: boolean) => {
      event.returnValue = 'success'

      if (updateIndicator) {
        autoUpdater.quitAndInstall()
      } else {
        app.relaunch()
        app.exit()
      }
    })

    // resize window
    ipcMain.on(
      'msgResizeWindow',
      (event: IpcMainEvent, width: number, height: number, fullscreen: boolean) => {
        event.returnValue = 'success'
        const mainWindow = BrowserWindow.getFocusedWindow()
        if (fullscreen) {
          mainWindow.maximize()
        } else {
          mainWindow.setSize(width, height, true)
          mainWindow.center()
        }
      }
    )

    // save the base url to the store
    ipcMain.on('msgSaveBaseUrl', (event: IpcMainEvent, baseUrl: string) => {
      store.set('baseUrl', baseUrl + '/')
      event.returnValue = 'success'
    })

    // get the baseUrl
    ipcMain.on('msgGetBaseUrl', (event: IpcMainEvent) => {
      // placeholder for now
      // store.set('baseUrl', 'http://localhost:9090/')
      event.returnValue = store.get('baseUrl', null)
    })

    // get the license server url from environment
    ipcMain.on('msgGetLicenseServerUrl', (event: IpcMainEvent) => {
      const licenseServer = JSON.parse(decrypt(store.get('license_server', null)))
      event.returnValue = licenseServer
    })

    ipcMain.on('msgSetLicenseServerUrl', (event: IpcMainEvent, url: string) => {
      store.set('license_server', encrypt(JSON.stringify(url)))
      event.returnValue = 'success'
    })

    ipcMain.on('msgCheckLicenseValidity', async (event: IpcMainEvent) => {
      let licenseStatus = 'NO_LICENSE'

      if (store.get('license', null) === null) {
        event.returnValue = licenseStatus
        return
      }
      const license = JSON.parse(decrypt(store.get('license')))
      const payload: any = {}
      payload.key = license.data.attributes.key
      payload.fingerprint = await machine()
      const licenseServer = JSON.parse(decrypt(store.get('license_server', null)))

      const validationResult = await axios.post(licenseServer + '/validate-license', payload)

      switch (validationResult.data.constant) {
        case 'VALID':
          licenseStatus = 'VALID'
          break
        case 'EXPIRED':
          licenseStatus = 'EXPIRED'
          break
        case 'SUSPENDED':
          licenseStatus = 'SUSPENDED'
          break
        default:
          licenseStatus = 'INVALID'
      }
      event.returnValue = licenseStatus
    })

    // get the user access token
    ipcMain.on('msgGetAccessToken', (event: IpcMainEvent) => {
      event.returnValue = store.get('access_token', null)
    })

    // get machine fingerprint
    ipcMain.on('msgGetMachineFingerprint', (event: IpcMainEvent) => {
      machine().then((id) => {
        event.returnValue = id
      })
    })

    // set the user license
    ipcMain.on('msgSetUserLicense', (event: IpcMainEvent, license: object) => {
      store.set('license', encrypt(JSON.stringify(license)))
      store.set('activated', true)
      machine().then((id) => {
        store.set('finger_print', id)
      })
      event.returnValue = 'success'
    })

    // get the current enviroment

    ipcMain.on('msgGetEnvironment', (event: IpcMainEvent) => {
      event.returnValue = process.env.NODE_ENV
    })

    ipcMain.on('msgGetUserLicense', (event: IpcMainEvent) => {
      event.returnValue = JSON.parse(decrypt(store.get('license', null)))
    })

    // activate license
    ipcMain.on('msgActivateLicense', async (event: IpcMainEvent, licenseKey: string) => {
      const fingerprint = await machine()
      const licenseServer = JSON.parse(decrypt(store.get('license_server', null)))
      const payload: any = {}
      payload.key = licenseKey
      payload.fingerprint = fingerprint

      const validation = await fetch(licenseServer + '/activate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          key: licenseKey,
          fingerprint
        })
      })

      const rs = await validation.json()

      event.returnValue = rs
    })
  }
}
