import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyCSdsGPVg0vuE3fppQmIC6luvbZsw5GZMc",
  authDomain: "sph4u-25c3a.firebaseapp.com",
  projectId: "sph4u-25c3a",
  storageBucket: "sph4u-25c3a.firebasestorage.app",
  messagingSenderId: "1076663892080",
  appId: "1:1076663892080:web:70d2d654a9c9d322435cb5"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export default app

