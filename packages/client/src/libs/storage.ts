import { Storage } from 'aws-amplify'
import { v4 as uuidv4 } from 'uuid'

export enum SecurityLevel {
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
  const allowedValues = Object.keys(SecurityLevel).map(s => s)

  if (!allowedValues.includes(securityLevel)) {
    throw new Error(`Unsupported security level ${securityLevel}`)
  }

  const urlOrObject = await Storage.get(key, { level: securityLevel })
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

export const uploadFile = (file: InputFile, vaultType = SecurityLevel.PRIVATE): Promise<UploadedFile> => {
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
      uploadedAt: `${new Date()}`
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
