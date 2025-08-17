import { useState, useEffect } from "react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

const SHUFFLE_ANIMATION_DURATION = 3000;
const SHUFFLE_INTERVAL = 150;

// Use a single global key for excluded numbers to persist them across sessions
const LS_EXCLUDED_GLOBAL = "hackALot_excludedNumbers";

interface HackALotProps {
  initialMaxNumber: number;
}

export const HackALot = ({ initialMaxNumber }: HackALotProps) => {
  const [maxNumber] = useState<number>(initialMaxNumber);
  const [availableNumbers, setAvailableNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [excludedNumbers, setExcludedNumbers] = useState<number[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [animationTrigger, setAnimationTrigger] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();

  // Load global excluded numbers and initialize component state
  useEffect(() => {
    let loadedExcludedNumbers: number[] = [];
    try {
      const savedExcluded = localStorage.getItem(LS_EXCLUDED_GLOBAL);
      if (savedExcluded) {
        loadedExcludedNumbers = JSON.parse(savedExcluded);
      }
    } catch (error) {
      console.error("Error loading excluded numbers from localStorage:", error);
      loadedExcludedNumbers = [];
    }

    setExcludedNumbers(loadedExcludedNumbers);

    const initialNumbers = Array.from({ length: maxNumber }, (_, i) => i + 1);
    const initialAvailable = initialNumbers.filter(
      (num) => !loadedExcludedNumbers.includes(num),
    );
    setAvailableNumbers(initialAvailable);

    setIsInitialized(true);
  }, [maxNumber]);

  // Save excluded numbers to local storage whenever they change
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(LS_EXCLUDED_GLOBAL, JSON.stringify(excludedNumbers));
    } catch (error) {
      console.error("Error saving excluded numbers to localStorage:", error);
    }
  }, [excludedNumbers, isInitialized]);

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

  const reset = () => {
    if (isShuffling) return;
    const initialNumbers = Array.from({ length: maxNumber }, (_, i) => i + 1);
    setAvailableNumbers(initialNumbers);
    setCurrentNumber(null);
    setExcludedNumbers([]);
    setIsRevealed(false);
    // Clear the global excluded numbers from local storage
    localStorage.removeItem(LS_EXCLUDED_GLOBAL);
  };

  const goBackToSetup = () => {
    navigate("/setup", { state: { maxNumber } });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-primary">Hack-a-Lot</CardTitle>
        <CardDescription>
          Shuffling from 1 to {maxNumber}. Good luck! 🚀
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" disabled={isShuffling}>
                Reset
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to reset?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will clear all drawn numbers across all sessions. This
                  action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={reset}>
                  Reset Session
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="link"
            onClick={goBackToSetup}
            disabled={isShuffling}
          >
            Go Back
          </Button>
          <Button
            variant="link"
            onClick={() => navigate("/")}
            disabled={isShuffling}
          >
            Go to Home
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