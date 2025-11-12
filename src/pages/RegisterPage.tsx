import { Box, Button, FormLabel, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { registrationSchema, type RegisterUser } from "../services/authSchemes";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { auth, db } from "../services/FireBaseConfig";
import { useEffect, useState } from "react";
import TopAlert from "../components/TopAlert";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../services/authContext";
export default function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterUser>({
    resolver: zodResolver(registrationSchema),
  });

  const { user, loading } = useAuth();
  const [firebaseError, setFirebaseError] = useState<string>();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async (response: { credential?: string }) => {
    if (response.credential) {
      setFirebaseError("");

      const googleCredential = GoogleAuthProvider.credential(
        response.credential
      );

      try {
        await signInWithCredential(auth, googleCredential);
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
          text: "signup_with",
          shape: "rectangular",
        });
      } else {
        setTimeout(initializeGoogleButton, 100);
      }
    };

    initializeGoogleButton();
  }, []);
  const onSubmit = async (data: RegisterUser) => {
    setFirebaseError("");
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await updateProfile(result.user, { displayName: data.name });

      await setDoc(doc(db, "users", result.user.uid), {
        name: data.name,
        email: data.email,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      if (err instanceof FirebaseError) {
        if (err.code === "auth/email-already-in-use") {
          setFirebaseError("Emailcím már foglalt!");
        } else if (err.code === "auth/weak-password") {
          setFirebaseError("A jelszó túl gyenge!");
        } else {
          setFirebaseError("Ismeretlen hiba történt.");
        }
      } else {
        setFirebaseError("Ismeretlen hiba történt.");
      }
    }
  };

  if (loading) {
    return <div>Betöltés...</div>;
  }
  return (
    <div>
      <Box
        component="form"
        id="register"
        noValidate
        autoComplete="off"
        display="flex"
        flexDirection="column"
        margin="auto"
        gap={2}
        sx={{ width: { xl: "75vh", md: "75vh" } }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormLabel form="register">Regisztráció</FormLabel>
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
          id="name"
          error={!!errors.name}
          label="Név"
          defaultValue=""
          {...register("name")}
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
        <TextField
          required
          id="passwordConfirm"
          type="password"
          label="Jelszó ismétlés"
          defaultValue=""
          helperText={errors.passwordConfirm?.message}
          {...register("passwordConfirm")}
        />

        <Button variant="contained" type="submit">
          Regisztráció
        </Button>
        <Box id="googleSignInButton" sx={{ alignSelf: "center" }}></Box>
        <Typography
          variant="caption"
          sx={{ textAlign: "center", color: "blue" }}
        >
          Már regisztrált? <Link to="/login">Jelentkezzen be!</Link>
        </Typography>
      </Box>
    </div>
  );
}
