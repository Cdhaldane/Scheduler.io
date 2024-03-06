import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://mydmcdgmioyieammrakm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZG1jZGdtaW95aWVhbW1yYWttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk1ODM2MDIsImV4cCI6MjAyNTE1OTYwMn0.X7r9Q0cnvPg5tW5EOj7CO0S0h1gMLvpKQv-oLHG26fM"
);

export const loginWithGoogle = async () => {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });
};

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
  const { data, error } = await supabase.from("users").select();
  if (error) {
    console.log("Error fetching users:", error);
  }
  return data;
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
