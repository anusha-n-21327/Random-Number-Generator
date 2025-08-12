import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const INITIAL_NUMBERS = Array.from({ length: 66 }, (_, i) => i + 1);
const SHUFFLE_ANIMATION_DURATION = 1000;
const SHUFFLE_INTERVAL = 150;

export const HackALot = () => {
  const [availableNumbers, setAvailableNumbers] =
    useState<number[]>(INITIAL_NUMBERS);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [excludedNumbers, setExcludedNumbers] = useState<number[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [animationTrigger, setAnimationTrigger] = useState(0);

  const drawNumber = () => {
    if (availableNumbers.length === 0 || isShuffling) {
      return;
    }

    setIsRevealed(false);
    setIsShuffling(true);

    const shuffleInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      const randomTempNumber = availableNumbers[randomIndex];
      setCurrentNumber(randomTempNumber);
      setAnimationTrigger((prev) => prev + 1);
    }, SHUFFLE_INTERVAL);

    setTimeout(() => {
      clearInterval(shuffleInterval);

      const finalRandomIndex = Math.floor(
        Math.random() * availableNumbers.length,
      );
      const drawnNumber = availableNumbers[finalRandomIndex];

      setCurrentNumber(drawnNumber);
      setExcludedNumbers((prev) => [...prev, drawnNumber]);
      setAvailableNumbers((prev) => prev.filter((num) => num !== drawnNumber));
      setIsShuffling(false);
      setIsRevealed(true);
    }, SHUFFLE_ANIMATION_DURATION);
  };

  const reset = () => {
    if (isShuffling) return;
    setAvailableNumbers(INITIAL_NUMBERS);
    setCurrentNumber(null);
    setExcludedNumbers([]);
    setIsRevealed(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Hack-a-Lot</CardTitle>
        <CardDescription>
          Draw a number from the pool. It will be excluded from future draws
          until you reset.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-6 py-10">
        <div
          className="w-48 h-48 bg-secondary rounded-lg flex items-center justify-center overflow-hidden"
          style={{ perspective: "1000px" }}
        >
          <span
            key={animationTrigger}
            className={`text-7xl font-bold text-secondary-foreground transition-opacity duration-300 ${
              isShuffling ? "animate-flip" : ""
            } ${isRevealed && !isShuffling ? "animate-zoom-in" : ""}`}
            style={{ transformStyle: "preserve-3d" }}
          >
            {currentNumber ?? "?"}
          </span>
        </div>
        <div className="flex space-x-4">
          <Button
            onClick={drawNumber}
            disabled={availableNumbers.length === 0 || isShuffling}
          >
            {isShuffling ? "Shuffling..." : "Start shuffling"}
          </Button>
          <Button onClick={reset} variant="outline" disabled={isShuffling}>
            Reset
          </Button>
        </div>
        {availableNumbers.length === 0 && !isShuffling && (
          <p className="text-muted-foreground pt-4">
            All numbers have been drawn!
          </p>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-2">
        <h3 className="font-semibold">Excluded Numbers:</h3>
        <div className="flex flex-wrap gap-2">
          {excludedNumbers.length > 0 ? (
            excludedNumbers.map((num) => (
              <Badge key={num} variant="secondary">
                {num}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No numbers excluded yet.
            </p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};