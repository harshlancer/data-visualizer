
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-50 dark:from-background dark:to-gray-950 text-foreground">
      <header className="w-full px-6 py-4 md:px-8 md:py-6 glass border-b border-gray-100 dark:border-gray-800/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5 text-primary"
              >
                <path d="M12 2v20" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold tracking-tight">
              <span className="font-light">covid</span>
              <span className="text-primary font-semibold">Stats</span>
            </h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Countries
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
          </nav>
        </div>
      </header>
      
      <main className={cn("max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-12", className)}>
        {children}
      </main>
      
      <footer className="w-full px-6 py-4 md:px-8 md:py-6 border-t border-gray-100 dark:border-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-muted-foreground text-center">
            Data provided by <a href="https://disease.sh/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">disease.sh</a> API. 
            This visualization is for educational purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
