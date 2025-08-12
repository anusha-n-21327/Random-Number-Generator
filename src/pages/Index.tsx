import { HackALot } from "@/components/HackALot";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <HackALot />
      <footer className="absolute bottom-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Anusha N. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;