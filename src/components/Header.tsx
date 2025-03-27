import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b h-16">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="text-xl font-semibold"
        >
          ValiNow
        </Button>
        <nav className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
          >
            Dashboard
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push("/validate")}
          >
            New Analysis
          </Button>
        </nav>
      </div>
    </header>
  );
} 