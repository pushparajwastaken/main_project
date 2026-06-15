import { setServers } from "dns";

export async function register() {
  // System DNS can't resolve Atlas SRV records.
  // Set Google DNS early so any process-level lookups also succeed.
  try {
    setServers(["8.8.8.8", "8.8.4.4"]);
  } catch {
    // Edge runtime doesn't have dns module — safe to ignore
  }
}
