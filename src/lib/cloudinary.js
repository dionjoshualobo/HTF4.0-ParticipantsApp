// Direct-from-browser Cloudinary upload using an UNSIGNED preset.
// Setup:
//   1. Cloudinary Dashboard → Settings → Upload → Add upload preset
//      - Signing Mode: Unsigned
//      - Folder: htf4 (optional)
//      - Allowed formats: jpg, png, gif, webp, mp4, mov, webm
//      - Max file size: 50 MB
//   2. Add to .env:  VITE_CLOUDINARY_CLOUD_NAME + VITE_CLOUDINARY_UPLOAD_PRESET
//
// Unsigned uploads are safe for public-facing media as long as the preset is
// locked down (size, type, folder). Do NOT use signed uploads here — that
// requires a server-side signing endpoint.

const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

export function isCloudinaryConfigured() {
  return Boolean(CLOUD_NAME && UPLOAD_PRESET)
}

/**
 * Uploads a File to Cloudinary. Resolves with:
 *   { publicUrl, publicId, mediaType: 'image' | 'video' }
 */
export function uploadToCloudinary(file, { onProgress } = {}) {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured()) {
      reject(new Error('Cloudinary not configured — set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET'))
      return
    }

    const isVideo = file.type.startsWith('video/')
    const resourceType = isVideo ? 'video' : 'image'
    const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`

    const form = new FormData()
    form.append('file', file)
    form.append('upload_preset', UPLOAD_PRESET)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', endpoint)

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText)
          resolve({
            publicUrl: res.secure_url,
            publicId:  res.public_id,
            mediaType: resourceType,
          })
        } catch {
          reject(new Error('Malformed Cloudinary response'))
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText)
          reject(new Error(err?.error?.message ?? `Upload failed (${xhr.status})`))
        } catch {
          reject(new Error(`Upload failed (${xhr.status})`))
        }
      }
    }

    xhr.onerror = () => reject(new Error('Network error during upload'))
    xhr.onabort = () => reject(new Error('Upload aborted'))

    xhr.send(form)
  })
}
