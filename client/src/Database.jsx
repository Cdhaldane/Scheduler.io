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

export const sendEmail = async (
  name,
  email,
  message,
  template = "template_5imqdhx"
) => {
  let messageString = message;
  if (typeof message === "object") {
    messageString = `Day: ${message.day}
    \nStart: ${message.start}:00
    \nEnd: ${message.end}:00
    \nService: ${message.service.name}
    \nPersonnel: ${message.personnel.first_name} ${message.personnel.last_name}
    \nPrice: $${message.price}
    \nAdditional Info: ${message.additionalInfo}`;
  }
  const response = await emailjs.send(
    "service_7xvem3p",
    template,
    {
      user_name: name,
      user_email: email,
      message: messageString,
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

export const getServiceFromId = async (id) => {
  const { data, error } = await supabase.from("services").select().eq("id", id);
  if (error) {
    console.log("Error fetching service:", error);
  }
  return data[0];
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

// PERSONNEL SERVICES HANDLERS

export const addPersonnelService = async (personnelId, newPersonnelService) => {
  const { data, error } = await supabase
    .from("personnel")
    .update({ services: newPersonnelService })
    .eq("id", personnelId)
    .select();
  if (error) {
    console.log("Error adding personnel service:", error);
  }
  return { data, error };
};

// BOOKINGS HANDLERS

export const getBookings = async (personnelId) => {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("personnel_id", personnelId);
  if (error) {
    console.log("Error fetching bookings:", error);
  }
  return data;
};

export const addBooking = async (newBooking) => {
  const { data, error } = await supabase
    .from("bookings")
    .insert([newBooking])
    .single()
    .select();
  if (error) {
    console.log("Error adding booking:", error);
  }
  return { data, error };
};
