import { Box, Button, FormLabel, TextField, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import { useForm } from "react-hook-form";
import registrationSchema, { type RegisterUser } from "../services/authSchemes";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { auth, db } from "../services/FireBaseConfig";
import { useState } from "react";
import TopAlert from "../components/TopAlert";
import { useNavigate } from "react-router";

export default function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterUser>({
    resolver: zodResolver(registrationSchema),
  });

  const [firebaseError, setFirebaseError] = useState<string>();

  const handleGoogleRegister = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      await setDoc(doc(db, "users", result.user.uid), {
        name: result.user.displayName,
        email: result.user.email,
        createdAt: serverTimestamp(),
      });

      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit = async (data: RegisterUser) => {
    setFirebaseError("");
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await updateProfile(result.user, { displayName: data.name });

      console.log(result.user.uid);
      await setDoc(doc(db, "users", result.user.uid), {
        name: data.name,
        email: data.email,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      if (err instanceof FirebaseError) {
        console.log(err.code);
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
      console.log(err);
    }
  };

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
        <Button variant="outlined" type="submit" onClick={handleGoogleRegister}>
          <Box>
            <Typography>Google Regisztráció</Typography>
            <GoogleIcon />
          </Box>
        </Button>
      </Box>
    </div>
  );
}
