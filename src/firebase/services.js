import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'
import { db } from './config'

export const getCollection = async (collectionName) => {
  try {
    const q = query(collection(db, collectionName), orderBy('timestamp', 'desc'))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error(`Error getting ${collectionName}:`, error)
    return []
  }
}

export const addToCollection = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      timestamp: serverTimestamp()
    })
    return docRef.id
  } catch (error) {
    console.error(`Error adding to ${collectionName}:`, error)
    throw error
  }
}

export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId)
    await updateDoc(docRef, data)
  } catch (error) {
    console.error(`Error updating ${collectionName}:`, error)
    throw error
  }
}

export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId)
    await deleteDoc(docRef)
  } catch (error) {
    console.error(`Error deleting from ${collectionName}:`, error)
    throw error
  }
}

export const subscribeToCollection = (collectionName, callback) => {
  const q = query(collection(db, collectionName), orderBy('timestamp', 'desc'))
  
  return onSnapshot(q, (querySnapshot) => {
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    callback(data)
  }, (error) => {
    console.error(`Error listening to ${collectionName}:`, error)
    callback([])
  })
}

export const getMessages = () => getCollection('messages')
export const addMessage = (message) => addToCollection('messages', message)
export const subscribeToMessages = (callback) => subscribeToCollection('messages', callback)

export const getPosts = () => getCollection('posts')
export const addPost = (post) => addToCollection('posts', post)
export const subscribeToPosts = (callback) => subscribeToCollection('posts', callback)

export const getEvents = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'events'))
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error getting events:', error)
    return []
  }
}

export const addEvent = (event) => addToCollection('events', event)
export const updateEvent = (eventId, data) => updateDocument('events', eventId, data)
export const deleteEvent = (eventId) => deleteDocument('events', eventId)
export const subscribeToEvents = (callback) => {
  return onSnapshot(collection(db, 'events'), (querySnapshot) => {
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    callback(data)
  }, (error) => {
    console.error('Error listening to events:', error)
    callback([])
  })
}

export const getResearchPapers = () => getCollection('researchPapers')
export const addResearchPaper = (paper) => addToCollection('researchPapers', paper)
export const subscribeToResearchPapers = (callback) => subscribeToCollection('researchPapers', callback)

export const getVideos = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'videos'))
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error getting videos:', error)
    return []
  }
}

export const addVideo = (video) => addToCollection('videos', video)
export const updateVideo = (videoId, data) => updateDocument('videos', videoId, data)
export const deleteVideo = (videoId) => deleteDocument('videos', videoId)
export const subscribeToVideos = (callback) => {
  return onSnapshot(collection(db, 'videos'), (querySnapshot) => {
    const data = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    callback(data)
  }, (error) => {
    console.error('Error listening to videos:', error)
    callback([])
  })
}

