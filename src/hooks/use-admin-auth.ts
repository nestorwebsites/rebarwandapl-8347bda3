import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import bcrypt from "bcryptjs";

const DEFAULT_PASSWORD = "pn4rqfzGcF";

export function useAdminAuth() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    ensureAdminConfig();
  }, []);

  async function ensureAdminConfig() {
    const { data } = await supabase.from("admin_config").select("*").limit(1);
    if (!data || data.length === 0) {
      const hash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
      await supabase.from("admin_config").insert({ hashed_password: hash });
    }
    setInitialized(true);
  }

  async function verifyPassword(password: string): Promise<boolean> {
    const { data } = await supabase.from("admin_config").select("hashed_password").limit(1).single();
    if (!data) return false;
    return bcrypt.compare(password, data.hashed_password);
  }

  async function changePassword(newPassword: string): Promise<boolean> {
    const { data } = await supabase.from("admin_config").select("id").limit(1).single();
    if (!data) return false;
    const hash = await bcrypt.hash(newPassword, 10);
    const { error } = await supabase.from("admin_config").update({ hashed_password: hash }).eq("id", data.id);
    return !error;
  }

  return { initialized, verifyPassword, changePassword };
}
