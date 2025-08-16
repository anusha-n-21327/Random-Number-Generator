import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HackALot } from "@/components/HackALot";

const ShufflePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const maxNumber = location.state?.maxNumber;

  useEffect(() => {
    if (!maxNumber) {
      // If no maxNumber is provided, redirect to setup
      navigate("/setup");
    }
  }, [maxNumber, navigate]);

  if (!maxNumber) {
    // Render nothing while redirecting
    return null;
  }

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <HackALot initialMaxNumber={maxNumber} />
      <footer className="absolute bottom-4 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Anusha N. All rights reserved.
      </footer>
    </div>
  );
};

export default ShufflePage;