import { HackALot } from "@/components/HackALot";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>
      <HackALot />
      <footer className="absolute bottom-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Anusha N. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;