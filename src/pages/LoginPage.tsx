import { useForm } from "react-hook-form";
import { loginSchema, type LoginUser } from "../services/authSchemes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, FormLabel, TextField, Typography } from "@mui/material";
import TopAlert from "../components/TopAlert";
import GoogleIcon from "@mui/icons-material/Google";
import {
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../services/FireBaseConfig";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const navigate = useNavigate();

  const [firebaseError, setFirebaseError] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUser>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    getRedirectResult(auth)
      .then(async (result) => {
        console.log("Redirect result, user:", result);
        if (result && result.user) {
          const userRef = doc(db, "users", result.user.uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            await setDoc(userRef, {
              name: result.user.displayName,
              email: result.user.email,
              createdAt: serverTimestamp(),
            });
          }
        }
      })
      .catch((err) => {
        setFirebaseError("Nem sikerült a Google belépés (redirect után)!");
        console.error(err);
      });
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async () => {
    setFirebaseError("");
    try {
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      const provider = new GoogleAuthProvider();

      if (isMobile) {
        await signInWithRedirect(auth, provider);
        return;
      } else {
        const result = await signInWithPopup(auth, provider);

        const userRef = doc(db, "users", result.user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            name: result.user.displayName,
            email: result.user.email,
            createdAt: serverTimestamp(),
          });
        }
      }
      navigate("/");
    } catch (err) {
      setFirebaseError("Nem sikerült a Google belépés!");
      console.error(err);
    }
  };

  const onSubmit = async (data: LoginUser) => {
    setFirebaseError("");
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (err) {
      setFirebaseError("Hibás email vagy jelszó!");
      console.error(err);
    }
  };

  return (
    <div>
      <Box
        component="form"
        id="login"
        noValidate
        autoComplete="off"
        display="flex"
        flexDirection="column"
        margin="auto"
        gap={2}
        sx={{ width: { xl: "75vh", md: "75vh" } }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormLabel form="login">Bejelntkezés</FormLabel>
        {firebaseError && <TopAlert message={firebaseError} severity="error" />}
        <TextField
          required
          id="email"
          error={!!errors.email}
          label="Email cím"
          defaultValue=""
          {...register("email")}
        />
        <TextField
          required
          id="password"
          type="password"
          label="Jelszó"
          defaultValue=""
          helperText={errors.password?.message}
          {...register("password")}
        />

        <Button variant="contained" type="submit">
          Bejelentkezés
        </Button>
        <Button variant="outlined" onClick={handleGoogleLogin}>
          <Box>
            <Typography>Google bejelentkezés</Typography>
            <GoogleIcon />
          </Box>
        </Button>
      </Box>
    </div>
  );
}
