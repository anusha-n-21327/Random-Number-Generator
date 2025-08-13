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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { cn } from "@/lib/utils";

const SHUFFLE_ANIMATION_DURATION = 3000;
const SHUFFLE_INTERVAL = 150;

// Local storage keys
const LS_PREFIX = "hackALot_";
const LS_MAX_NUMBER = `${LS_PREFIX}maxNumber`;
const LS_AVAILABLE = `${LS_PREFIX}availableNumbers`;
const LS_EXCLUDED = `${LS_PREFIX}excludedNumbers`;
const LS_CURRENT = `${LS_PREFIX}currentNumber`;

export const HackALot = () => {
  const [inputValue, setInputValue] = useState<string>("50");
  const [maxNumber, setMaxNumber] = useState<number>(50);
  const [availableNumbers, setAvailableNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [excludedNumbers, setExcludedNumbers] = useState<number[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [animationTrigger, setAnimationTrigger] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  // Load state from local storage on initial render
  useEffect(() => {
    try {
      const savedMax = localStorage.getItem(LS_MAX_NUMBER);
      const savedAvailable = localStorage.getItem(LS_AVAILABLE);
      const savedExcluded = localStorage.getItem(LS_EXCLUDED);
      const savedCurrent = localStorage.getItem(LS_CURRENT);

      const initialMax = savedMax ? JSON.parse(savedMax) : 50;
      setMaxNumber(initialMax);
      setInputValue(String(initialMax));

      if (savedAvailable && savedExcluded) {
        setAvailableNumbers(JSON.parse(savedAvailable));
        setExcludedNumbers(JSON.parse(savedExcluded));
        const current = savedCurrent ? JSON.parse(savedCurrent) : null;
        if (current !== null) {
          setCurrentNumber(current);
          setIsRevealed(true);
        }
      } else {
        const initialNumbers = Array.from({ length: initialMax }, (_, i) => i + 1);
        setAvailableNumbers(initialNumbers);
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
      const initialNumbers = Array.from({ length: 50 }, (_, i) => i + 1);
      setAvailableNumbers(initialNumbers);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save state to local storage whenever it changes
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(LS_MAX_NUMBER, JSON.stringify(maxNumber));
      localStorage.setItem(LS_AVAILABLE, JSON.stringify(availableNumbers));
      localStorage.setItem(LS_EXCLUDED, JSON.stringify(excludedNumbers));
      localStorage.setItem(LS_CURRENT, JSON.stringify(currentNumber));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [maxNumber, availableNumbers, excludedNumbers, currentNumber, isInitialized]);

  const handleSetRange = () => {
    const newMax = parseInt(inputValue, 10);
    if (isShuffling || isNaN(newMax) || newMax <= 0) {
      return;
    }

    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 500); // Animation is 0.5s

    setMaxNumber(newMax);

    // Filter existing excluded numbers to ensure they are within the new range
    const updatedExcludedNumbers = excludedNumbers.filter(num => num <= newMax);
    setExcludedNumbers(updatedExcludedNumbers);

    // Generate the new full range of numbers
    const newInitialNumbers = Array.from({ length: newMax }, (_, i) => i + 1);

    // Create new available numbers by filtering out the updated excluded numbers
    const newAvailableNumbers = newInitialNumbers.filter(num => !updatedExcludedNumbers.includes(num));
    setAvailableNumbers(newAvailableNumbers);

    setCurrentNumber(null);
    setIsRevealed(false);
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
      const finalRandomIndex = Math.floor(Math.random() * availableNumbers.length);
      const drawnNumber = availableNumbers[finalRandomIndex];
      setCurrentNumber(drawnNumber);
      setExcludedNumbers((prev) => [...prev, drawnNumber].sort((a, b) => a - b));
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
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-primary">Hack-a-Lot</CardTitle>
        <CardDescription>
          Pick a number from the pool and unlock your next exciting challenge —
          every draw brings a fresh adventure! 🚀
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-6 py-10">
        <div className="w-full space-y-2">
          <Label htmlFor="max-number-input">How many numbers to shuffle?</Label>
          <div className="flex space-x-2">
            <Input
              id="max-number-input"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter the numbers to shuffle..."
              disabled={isShuffling}
            />
            <Button 
              onClick={handleSetRange} 
              disabled={isShuffling}
              className={cn(isFlashing && "animate-flash-white")}
            >
              Set
            </Button>
          </div>
        </div>
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
          <Button onClick={drawNumber} disabled={availableNumbers.length === 0 || isShuffling}>
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
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will clear all excluded
                  numbers and reset the game.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={reset}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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