import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { showError } from "@/utils/toast";
import { Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const SHUFFLE_ANIMATION_DURATION = 3000;
const SHUFFLE_INTERVAL = 150;

const LS_EXCLUDED_GLOBAL = "hackALot_excludedNumbers";
const LS_MAX_NUMBER_GLOBAL = "hackALot_maxNumber";

const HomePage = () => {
  const [maxNumber, setMaxNumber] = useState<number | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [availableNumbers, setAvailableNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [excludedNumbers, setExcludedNumbers] = useState<number[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [animationTrigger, setAnimationTrigger] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const savedMax = localStorage.getItem(LS_MAX_NUMBER_GLOBAL);
      const savedExcluded = localStorage.getItem(LS_EXCLUDED_GLOBAL);

      const loadedMax = savedMax ? parseInt(savedMax, 10) : null;
      const loadedExcluded = savedExcluded ? JSON.parse(savedExcluded) : [];

      if (loadedMax) {
        setMaxNumber(loadedMax);
        setInputValue(loadedMax.toString());
        setExcludedNumbers(loadedExcluded);
        const initialNumbers = Array.from(
          { length: loadedMax },
          (_, i) => i + 1,
        );
        const initialAvailable = initialNumbers.filter(
          (num) => !loadedExcluded.includes(num),
        );
        setAvailableNumbers(initialAvailable);
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(LS_EXCLUDED_GLOBAL, JSON.stringify(excludedNumbers));
    } catch (error) {
      console.error("Error saving excluded numbers to localStorage:", error);
    }
  }, [excludedNumbers, isInitialized]);

  const handleSetup = () => {
    const num = parseInt(inputValue, 10);
    if (isNaN(num) || num <= 0) {
      showError("Please enter a valid number greater than 0.");
      return;
    }
    setMaxNumber(num);
    setAvailableNumbers(Array.from({ length: num }, (_, i) => i + 1));
    setExcludedNumbers([]);
    setCurrentNumber(null);
    setIsRevealed(false);
    localStorage.setItem(LS_MAX_NUMBER_GLOBAL, num.toString());
    localStorage.setItem(LS_EXCLUDED_GLOBAL, JSON.stringify([]));
  };

  const drawNumber = () => {
    if (availableNumbers.length === 0 || isShuffling) return;

    setIsRevealed(false);
    setIsShuffling(true);

    const shuffleInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      setCurrentNumber(availableNumbers[randomIndex]);
      setAnimationTrigger((prev) => prev + 1);
    }, SHUFFLE_INTERVAL);

    setTimeout(() => {
      clearInterval(shuffleInterval);
      const finalRandomIndex = Math.floor(
        Math.random() * availableNumbers.length,
      );
      const drawnNumber = availableNumbers[finalRandomIndex];
      setCurrentNumber(drawnNumber);
      setExcludedNumbers((prev) =>
        [...prev, drawnNumber].sort((a, b) => a - b),
      );
      setAvailableNumbers((prev) => prev.filter((num) => num !== drawnNumber));
      setIsShuffling(false);
      setIsRevealed(true);
    }, SHUFFLE_ANIMATION_DURATION);
  };

  const handleResetExcluded = () => {
    if (!maxNumber || isShuffling) return;

    setExcludedNumbers([]);
    setAvailableNumbers(Array.from({ length: maxNumber }, (_, i) => i + 1));
    setCurrentNumber(null);
    setIsRevealed(false);
    localStorage.setItem(LS_EXCLUDED_GLOBAL, JSON.stringify([]));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-md mx-auto transition-transform duration-300 hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <Zap className="h-8 w-8" />
            Hack-a-Lot
          </CardTitle>
          <CardDescription>
            Enter the total number of tasks to start shuffling.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full items-center space-x-2">
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Total Numbers to Shuffle"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleSetup()}
            />
            <Button
              onClick={handleSetup}
              className="transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              Set
            </Button>
          </div>

          <Separator className="my-6" />
          <div className="flex flex-col items-center justify-center space-y-6">
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
                disabled={!maxNumber || availableNumbers.length === 0 || isShuffling}
                className="transition-transform duration-200 hover:scale-105 active:scale-95"
              >
                {isShuffling ? "Shuffling..." : "Start shuffling"}
              </Button>
              <Button
                variant="outline"
                onClick={handleResetExcluded}
                disabled={!maxNumber || excludedNumbers.length === 0 || isShuffling}
                className="transition-transform duration-200 hover:scale-105 active:scale-95"
              >
                Reset
              </Button>
            </div>
            {maxNumber && availableNumbers.length === 0 && !isShuffling && (
              <p className="text-muted-foreground pt-4">
                All numbers have been drawn!
              </p>
            )}
          </div>
        </CardContent>
        {maxNumber && (
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
        )}
      </Card>
      <footer className="absolute bottom-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Anusha N. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;