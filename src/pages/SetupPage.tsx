import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Label } from "@/components/ui/label";
import { showError } from "@/utils/toast";

const SetupPage = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const navigate = useNavigate();

  const handleNext = () => {
    const num = parseInt(inputValue, 10);
    if (isNaN(num) || num <= 0) {
      showError("Please enter a valid number greater than 0.");
      return;
    }
    navigate("/shuffle", { state: { maxNumber: num } });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Setup Your Challenge</CardTitle>
          <CardDescription>
            How many tasks are we shuffling today?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="max-number-input">Total Numbers to Shuffle</Label>
            <Input
              id="max-number-input"
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter the total number of tasks"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleNext()}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleNext}>Let's Go!</Button>
        </CardFooter>
      </Card>
      <footer className="absolute bottom-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Anusha N. All rights reserved.
      </footer>
    </div>
  );
};

export default SetupPage;