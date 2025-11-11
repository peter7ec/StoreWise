import { useEffect, useState, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signOut,
  type User,
  getRedirectResult,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./FireBaseConfig";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRedirectResult(auth).catch((error) => {
      console.error("Hiba a redirect feldolgozása közben:", error);
    });

    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        const userRef = doc(db, "users", userAuth.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          try {
            await setDoc(userRef, {
              name: userAuth.displayName,
              email: userAuth.email,
              createdAt: serverTimestamp(),
            });
          } catch (error) {
            console.error("Hiba a Firestore dokumentum létrehozásakor:", error);
          }
        }
        setUser(userAuth);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
