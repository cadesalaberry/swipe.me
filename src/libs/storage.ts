import { Storage } from 'aws-amplify'
import { v4 as uuidv4 } from 'uuid'

interface IInputFile {
  name: string;
  type: string;
  size: number;
  lastModified: number;
}

export const preloadImage = (imageURL: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = (e) => resolve(imageURL)
    img.onerror = (e) => reject(e)

    img.src = imageURL
  })
}

export const loadImagePreview = (file: Blob) => {
  return new Promise((resolve, reject) => {
    var reader = new FileReader()

    reader.onload = (e) => resolve(e.target?.result)
    reader.onerror = (e) => reject(reader.error)

    reader.readAsDataURL(file)
  })
}

export const uploadFile = (file: IInputFile) => {
  const extension = file.name.split('.').pop()
  const randomIdentifier = uuidv4()
  const uniqueFilename = `${randomIdentifier}.${extension}`
  const metadata = {
    contentType: file.type,
    // level: 'public',
    name: file.name,
    size: file.size,
    lastModified: file.lastModified,
    uploadedAt: Date.now()
  }

  return Storage.vault
    .put(uniqueFilename, file, metadata)
    .then(async (stored: any) => {
      const key = stored.key
      const url = await Storage.vault.get(key)

      return {
        url,
        key
      }
    })
}
