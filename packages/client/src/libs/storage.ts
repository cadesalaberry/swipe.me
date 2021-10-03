import { Storage } from 'aws-amplify'
import { StorageAccessLevel } from '@aws-amplify/storage'
import { v4 as uuidv4 } from 'uuid'

/* eslint-disable no-unused-vars */
/* FIXME: The @typescript-eslint/no-unused-vars should apply, not the JS one */
export enum SecurityLevelEnum {
  /**
   * Readable by all users, but writable only by the creating user
   */
  PROTECTED = 'protected',
  /**
   * Only accessible for the individual user
   */
  PRIVATE = 'private',
  /**
   * Accessible by all users of your app. Files are stored under the `public/` path in your S3 bucket
   */
  PUBLIC = 'public'
}
/* eslint-enable no-unused-vars */

export const SecurityLevel = Object.freeze({
  PROTECTED: SecurityLevelEnum.PROTECTED,
  PRIVATE: SecurityLevelEnum.PRIVATE,
  PUBLIC: SecurityLevelEnum.PUBLIC
})

/**
 * I had to trick to make the ts compiler happy:
 *   48 Type 'string' is not assignable to type 'StorageAccessLevel | undefined'.
 *   49 |   }
 *   50 |
 * > 51 |   const urlOrObject = await Storage.get(key, { level: securityLevel })
 *      |                                                ^
 * @param level string
 * @returns boolean
 */
function isValidSecurityLevel (level: string): level is SecurityLevelEnum {
  return [
    SecurityLevelEnum.PRIVATE,
    SecurityLevelEnum.PROTECTED,
    SecurityLevelEnum.PUBLIC
  ].includes(level as SecurityLevelEnum)
}

interface InputFile {
  name: string;
  type: string;
  size: number;
  lastModified: number;
}

interface UploadedFile {
  url: string;
  key: string;
}

/**
 * Handles path such as: s3://private/drgerbvdb.png
 * @param url a url string
 */
export const getAuthenticatedUrl = async (url: string): Promise<string> => {
  if (typeof url !== 'string') return url

  if (!url.startsWith('s3://')) {
    return url
  }

  const protocolLess = url.slice(5) // takes out s3://
  const [securityLevel, ...rest] = protocolLess.split('/') // reads the vault value
  const key = rest.join('/')

  if (!isValidSecurityLevel(securityLevel)) {
    throw new Error(`Unsupported security level ${securityLevel}`)
  }

  const storageAccessLevel = securityLevel as StorageAccessLevel
  const urlOrObject = await Storage.get(key, { level: storageAccessLevel })
  const authenticatedUrl = urlOrObject as string
  const parsed = new URL(authenticatedUrl)
  const publicUrl = [parsed.origin, parsed.pathname].join('')

  if (securityLevel === SecurityLevel.PRIVATE) return authenticatedUrl

  return publicUrl
}

export const preloadImage = async (imageUrl: string): Promise<string> => {
  const authenticatedUrl = await getAuthenticatedUrl(imageUrl)
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => resolve(imageUrl)
    img.onerror = (e) => reject(e)

    img.src = authenticatedUrl
  })
}

export const loadImagePreview = (file: Blob): unknown => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => resolve(e.target?.result)
    reader.onerror = () => reject(reader.error)

    reader.readAsDataURL(file)
  })
}

export const uploadFile = (file: InputFile, vaultType: StorageAccessLevel = SecurityLevel.PRIVATE): Promise<UploadedFile> => {
  const extension = file.name.split('.').pop()
  const randomIdentifier = uuidv4()
  const uniqueFilename = `${randomIdentifier}.${extension}`
  const metadata = {
    contentType: file.type,
    level: vaultType,
    metadata: {
      uniqueFilename,
      type: file.type,
      name: file.name,
      size: `${file.size}`, // makes sure we handle strings
      lastModified: `${file.lastModified}`, // makes sure we handle strings
      uploadedAt: `${new Date().toISOString()}`
    }
  }

  return Storage
    .put(uniqueFilename, file, metadata)
    .then(async (stored: unknown) => {
      const { key } = stored as { key: string }
      const privateUrl = `s3://${vaultType}/${key}`
      const url = vaultType === SecurityLevel.PRIVATE
        ? privateUrl
        : await getAuthenticatedUrl(privateUrl)

      return {
        url,
        key
      }
    })
}
