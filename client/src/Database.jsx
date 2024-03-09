import { createClient } from "@supabase/supabase-js";
import emailjs from "@emailjs/browser";
import { useLocation } from "react-router-dom";

export const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_KEY
);

export const getPersonnel = async () => {
  const { data, error } = await supabase.from("personnel").select();
  if (error) {
    console.log("Error fetching personnel:", error);
  }
  return data;
};

export const addPersonnel = async (newPersonnel) => {
  const { data, error } = await supabase
    .from("personnel")
    .insert([newPersonnel])
    .single()
    .select();
  if (error) {
    console.log("Error adding personnel:", error);
  }
  return { data, error };
};

export const deletePersonnel = async (id) => {
  const { data, error } = await supabase
    .from("personnel")
    .delete()
    .eq("id", id)
    .select();
  if (error) {
    console.log("Error deleting personnel:", error);
  }
  return { data, error };
};

// USERS HANDLERS

export const getUsers = async () => {
  const {
    data: { users },
    error,
  } = await supabase.auth.admin.listUsers();

  if (error) {
    console.log("Error fetching users:", error);
  }

  return users;
};

export const addUser = async (newUser) => {
  const { data, error } = await supabase
    .from("users")
    .insert([newUser])
    .single()
    .select();
  if (error) {
    console.log("Error adding user:", error);
  }
  return { data, error };
};

export const deleteUser = async (id) => {
  const { data, error } = await supabase
    .from("users")
    .delete()
    .eq("id", id)
    .select();
  if (error) {
    console.log("Error deleting user:", error);
  }
  return { data, error };
};

// AUTH

export const loginWithGoogle = async (redirect) => {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirect,
    },
  });
};

export const loginWithGithub = async () => {
  await supabase.auth.signInWithOAuth({
    provider: "github",
  });
};

export const loginWithMicrosoft = async () => {
  await supabase.auth.signInWithOAuth({
    provider: "microsoft",
  });
};

export const signUp = async (email, password, name) => {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      emailRedirectTo: "http://localhost:3000/admin",
    },
  });
  if (!error) {
    const { data, error } = await supabase.auth.updateUser({
      email: "new@email.com",
      password: "new-password",
      data: { full_name: name },
    });
    return { data, error };
  }
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  if (error) {
    console.log("Error signing in:", error);
  }
  return { data, error };
};

export const sendEmail = async (name, email, message) => {
  const response = await emailjs.send(
    "service_7xvem3p",
    "template_5imqdhx",
    {
      user_name: name,
      user_email: email,
      message: message,
    },
    {
      publicKey: "g49oHx9bZd0NTtYal",
    }
  );

  return response;
};

// SERVICES HANDLERS

export const getServices = async () => {
  const { data, error } = await supabase.from("services").select();
  if (error) {
    console.log("Error fetching services:", error);
  }
  return data;
};

export const addService = async (newService) => {
  const data = await supabase
    .from("services")
    .insert([newService])
    .single()
    .select();
  if (!data) {
    console.log("Error adding service:", data);
  }
  return data;
};

export const deleteService = async (id) => {
  const data = await supabase.from("services").delete().eq("id", id).select();
  if (!data) {
    console.log("Error deleting service:", data.error);
  }
  return data;
};
