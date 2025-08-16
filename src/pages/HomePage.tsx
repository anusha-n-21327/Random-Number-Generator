import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Zap } from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md text-center animate-zoom-in">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center gap-2">
            <Zap className="h-8 w-8" />
            Welcome to Hack-a-Lot!
          </CardTitle>
          <CardDescription className="text-lg">
            Your next great challenge is just a click away.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Ready to tackle a new task and unleash your creativity? Let's
            shuffle the possibilities and find your next mission. Every draw is
            a new opportunity to learn and grow.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild size="lg">
            <Link to="/setup">Start Your Adventure!</Link>
          </Button>
        </CardFooter>
      </Card>
      <footer className="absolute bottom-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Anusha N. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;