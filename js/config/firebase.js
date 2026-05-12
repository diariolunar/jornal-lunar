import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAHtrL1LEtpnKZ9QdGl2ehveCOZLWM94VE",
  authDomain: "diario-lunar-dee91.firebaseapp.com",
  projectId: "diario-lunar-dee91",
  storageBucket: "diario-lunar-dee91.firebasestorage.app",
  messagingSenderId: "817640390152",
  appId: "1:817640390152:web:89e4b6a032b2124a6f1bbd"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
