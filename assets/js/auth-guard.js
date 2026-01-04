import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabase = createClient(
  "https://bnawrgrhmvkyzkixlbkc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJuYXdyZ3JobXZreXpraXhsYmtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2NDA2MDUsImV4cCI6MjA4MTIxNjYwNX0.msUs2RMnJqAs086mkV4FTNIEOHb_3i-hGX5B0sWtolg"
);

document.addEventListener("DOMContentLoaded", async () => {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = "login.html";
    return;
  }

  const user = session.user;
  window.USER_ID = user.id;

  console.log("USER:", user); // 🔍 DEBUG

  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "User";

  const nameEl = document.getElementById("user-name");
  if (nameEl) {
    nameEl.textContent = name;
  }
});
