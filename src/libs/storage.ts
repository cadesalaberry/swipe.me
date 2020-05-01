import { Storage } from 'aws-amplify'
import { v4 as uuidv4 } from 'uuid'

enum Vault {
  PRIVATE = 'private',
  PUBLIC = 'public'
}
interface InputFile {
  name: string;
  type: string;
  size: number;
  lastModified: number;
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
  const [vaultType, ...rest] = protocolLess.split('/') // reads the vault value
  const key = rest.join('/')

  const vault = vaultType === Vault.PRIVATE
    ? Storage.vault
    : Storage

  const authenticatedUrl = await vault.get(key)

  return authenticatedUrl as string
}

export const preloadImage = async (imageUrl: string) => {
  const authenticatedUrl = await getAuthenticatedUrl(imageUrl)
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => resolve(imageUrl)
    img.onerror = (e) => reject(e)

    img.src = authenticatedUrl
  })
}

export const loadImagePreview = (file: Blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => resolve(e.target?.result)
    reader.onerror = () => reject(reader.error)

    reader.readAsDataURL(file)
  })
}

export const uploadFile = (file: InputFile, vaultType: Vault = Vault.PRIVATE) => {
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
      const url = `s3://${vaultType}/${key}`

      return {
        url,
        key
      }
    })
}
