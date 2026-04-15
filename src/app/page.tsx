import { redirect } from "next/navigation";

export default function Home() {
  // Redirecționăm automat către dashboard (care va verifica dacă ești logat prin middleware sau layout)
  // Force redeploy - v1.0.1
  redirect("/dashboard");
}
