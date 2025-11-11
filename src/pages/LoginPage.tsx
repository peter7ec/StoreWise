import { useForm } from "react-hook-form";

import { loginSchema, type LoginUser } from "../services/authSchemes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, FormLabel, TextField, Typography } from "@mui/material";
import TopAlert from "../components/TopAlert";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../services/FireBaseConfig";
import { Link, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../services/authContext";
import { FirebaseError } from "firebase/app";

export default function LoginPage() {
  const navigate = useNavigate();

  const { user, loading } = useAuth();
  const [firebaseError, setFirebaseError] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUser>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async (response: { credential?: string }) => {
    if (response.credential) {
      console.log("Google bejelentkezés sikeres, token fogadva.");
      setFirebaseError("");

      const googleCredential = GoogleAuthProvider.credential(
        response.credential
      );

      try {
        await signInWithCredential(auth, googleCredential);
        console.log("Firebase signInWithCredential sikeres.");
      } catch (error) {
        console.error("Firebase signInWithCredential hiba:", error);
        if (error instanceof FirebaseError) {
          setFirebaseError(`Hiba a Google fiókkal: ${error.code}`);
        } else {
          setFirebaseError("Ismeretlen hiba történt a bejelentkezés során.");
        }
      }
    } else {
      setFirebaseError("Google nem adott vissza hitelesítő adatot.");
      console.error(
        "A Google response objektum nem tartalmazta a 'credential' mezőt.",
        response
      );
    }
  };

  useEffect(() => {
    const initializeGoogleButton = () => {
      const googleButtonDiv = document.getElementById("googleSignInButton");

      if (window.google && googleButtonDiv) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleSignIn,
        });

        window.google.accounts.id.renderButton(googleButtonDiv, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "signin_with",
          shape: "rectangular",
        });
      } else {
        setTimeout(initializeGoogleButton, 100);
      }
    };

    initializeGoogleButton();
  }, []);

  const onSubmit = async (data: LoginUser) => {
    setFirebaseError("");
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (err) {
      setFirebaseError("Hibás email vagy jelszó!");
      console.error(err);
    }
  };
  if (loading) {
    return <div>Betöltés...</div>;
  }
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
        <Box id="googleSignInButton" sx={{ alignSelf: "center" }}></Box>
        <Typography
          variant="caption"
          sx={{ textAlign: "center", color: "blue" }}
        >
          Nem regisztrált még? <Link to="/register">Regisztráljon!</Link>
        </Typography>
      </Box>
    </div>
  );
}
