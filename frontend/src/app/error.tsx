"use client";

import { useEffect } from "react";
import { AlertOctagon, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background px-4 text-center text-foreground relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-destructive/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
          
          <motion.div 
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-destructive/20 blur-2xl rounded-full" />
            <div className="relative bg-background/80 backdrop-blur-xl p-8 rounded-full border border-destructive/20 shadow-2xl">
              <AlertOctagon className="h-24 w-24 text-destructive" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="space-y-4 max-w-md"
          >
            <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-destructive to-destructive/60">
              System Error
            </h1>
            <p className="text-lg text-muted-foreground">
              An unexpected anomaly occurred. Our systems have logged the issue, but you can try the operation again.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button 
              onClick={reset} 
              size="lg" 
              className="rounded-full px-8 gap-2 group shadow-lg shadow-primary/20"
            >
              <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              Try Again
            </Button>
            <Link href="/">
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full px-8 gap-2 group w-full sm:w-auto"
              >
                <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Return Home
              </Button>
            </Link>
          </motion.div>
        </div>
      </body>
    </html>
  );
}
