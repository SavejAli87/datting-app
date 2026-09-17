import client from './client'

// ProfileController
export const setupProfile = (userId, dto, photoFile) => {
  const form = new FormData()
  Object.entries(dto).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') form.append(key, value)
  })
  if (photoFile) form.append('photo', photoFile)
  return client
    .post(`/profile/${userId}/setup`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data)
}

export const uploadProfileImage = (userId, imageFile) => {
  const form = new FormData()
  form.append('userId', userId)
  form.append('image', imageFile)
  return client
    .post('/profile/upload-image', form, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((r) => r.data)
}

export const saveGenderOrientation = (userId, gender, orientation) =>
  client.post('/profile/gender-orientation', { userId, gender, orientation }).then((r) => r.data)

export const getMyProfile = (userId) =>
  client.get(`/profile/me/${userId}`).then((r) => r.data)

export const uploadSelfie = (userId, selfieFile) => {
  const form = new FormData()
  form.append('userId', userId)
  form.append('selfie', selfieFile)
  return client
    .post('/profile/selfie/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((r) => r.data)
}

export const verifySelfie = (userId) =>
  client.put(`/profile/selfie/verify/${userId}`).then((r) => r.data)

export const updateBasic = (dto) =>
  client.put('/profile/update-basic', dto).then((r) => r.data)

export const updateDetails = (dto) =>
  client.put('/profile/update-details', dto).then((r) => r.data)

export const updatePreferences = (dto) =>
  client.put('/profile/update-preferences', dto).then((r) => r.data)

export const getProfileCompletion = (userId) =>
  client.get(`/profile/completion/${userId}`).then((r) => r.data)

// UserImageController — gallery images keyed by user "code" (string userId)
export const uploadGalleryImage = (userId, imageFile) => {
  const form = new FormData()
  form.append('image', imageFile)
  return client
    .post(`/users/${userId}/images`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((r) => r.data)
}

export const getGalleryImages = (userId) =>
  client.get(`/users/${userId}/images`).then((r) => r.data)

export const deleteGalleryImage = (imageId) =>
  client.delete(`/users/images/${imageId}`).then((r) => r.data)

export const setProfilePhoto = (userId, imageId) =>
  client.put(`/users/${userId}/profile-photo/${imageId}`).then((r) => r.data)
