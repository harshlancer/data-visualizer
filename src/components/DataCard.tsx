
import { cn } from "@/lib/utils";

interface DataCardProps {
  title: string;
  value: number | string;
  delta?: number;
  deltaLabel?: string;
  icon?: React.ReactNode;
  color?: string;
  isLoading?: boolean;
  className?: string;
}

const DataCard = ({
  title,
  value,
  delta,
  deltaLabel = "from yesterday",
  icon,
  color = "blue",
  isLoading = false,
  className,
}: DataCardProps) => {
  // Format large numbers
  const formattedValue = typeof value === 'number' ? 
    new Intl.NumberFormat().format(value) : 
    value;
  
  // Format delta value and determine if it's positive or negative
  const formattedDelta = delta && new Intl.NumberFormat().format(Math.abs(delta));
  const isDeltaPositive = delta && delta > 0;
  const isDeltaNegative = delta && delta < 0;

  // Map color string to Tailwind classes
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-900",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-900",
    purple: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-900",
    pink: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/50 dark:text-pink-300 dark:border-pink-900",
    red: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-900",
    orange: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/50 dark:text-orange-300 dark:border-orange-900",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/50 dark:text-yellow-300 dark:border-yellow-900",
    green: "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/50 dark:text-green-300 dark:border-green-900",
    teal: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-900",
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-300 dark:border-cyan-900",
  }[color] || "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800";

  return (
    <div
      className={cn(
        "relative glass-card overflow-hidden p-6 rounded-2xl transition-all duration-300 hover:shadow-md",
        className
      )}
    >
      {isLoading ? (
        <div className="space-y-3">
          <div className="skeleton-loading h-4 w-1/2 rounded"></div>
          <div className="skeleton-loading h-8 w-3/4 rounded"></div>
          <div className="skeleton-loading h-4 w-2/3 rounded"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            {icon && (
              <span className={cn("p-1 rounded-full", colorClasses)}>
                {icon}
              </span>
            )}
          </div>
          <p className="text-3xl font-bold tracking-tight">{formattedValue}</p>
          {delta !== undefined && (
            <div className="mt-2 flex items-center text-sm">
              <span
                className={cn(
                  "inline-flex items-center mr-1",
                  isDeltaPositive && "text-red-600 dark:text-red-400",
                  isDeltaNegative && "text-green-600 dark:text-green-400",
                  !isDeltaPositive && !isDeltaNegative && "text-gray-600 dark:text-gray-400"
                )}
              >
                {isDeltaPositive && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 mr-1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {isDeltaNegative && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 mr-1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {formattedDelta}
              </span>
              <span className="text-muted-foreground">{deltaLabel}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DataCard;
