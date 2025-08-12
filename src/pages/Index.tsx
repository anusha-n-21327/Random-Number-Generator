import { NumberShuffler } from "@/components/NumberShuffler";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <NumberShuffler />
      <div className="absolute bottom-0 w-full">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;