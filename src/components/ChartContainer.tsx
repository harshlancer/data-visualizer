
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  TooltipProps
} from 'recharts';
import { ChartData } from '@/types';

interface ChartContainerProps {
  data: ChartData[];
  title: string;
  color?: string;
  type?: 'line' | 'bar' | 'area' | 'pie';
  isLoading?: boolean;
  className?: string;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-3 border border-gray-200/50 dark:border-gray-800/50 rounded-lg shadow-sm">
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-sm font-medium">
          <span style={{ color: payload[0].color }}>●</span>{' '}
          {new Intl.NumberFormat().format(payload[0].value as number)}
        </p>
      </div>
    );
  }

  return null;
};

const ChartContainer = ({
  data,
  title,
  color = '#61DAFB',
  type = 'line',
  isLoading = false,
  className,
}: ChartContainerProps) => {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area' | 'pie'>(type);
  
  // Handle empty or loading data
  if (isLoading) {
    return (
      <div className={cn("glass-card p-6 rounded-2xl h-80", className)}>
        <div className="flex items-center justify-between mb-6">
          <div className="skeleton-loading h-5 w-1/3 rounded"></div>
          <div className="skeleton-loading h-8 w-1/4 rounded"></div>
        </div>
        <div className="h-full w-full flex items-center justify-center">
          <div className="skeleton-loading h-52 w-full rounded-lg"></div>
        </div>
      </div>
    );
  }
  
  // Format Y-axis tick values
  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value;
  };

  // Determine the chart based on type
  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              dy={10}
            />
            <YAxis 
              tickFormatter={formatYAxis} 
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              fill={color} 
              radius={[4, 4, 0, 0]} 
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </BarChart>
        );
        
      case 'area':
        return (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                <stop offset="95%" stopColor={color} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              dy={10}
            />
            <YAxis 
              tickFormatter={formatYAxis} 
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              fill="url(#colorGradient)" 
              activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </AreaChart>
        );
        
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              animationDuration={1500}
              animationEasing="ease-in-out"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index % 2 === 0 ? color : `${color}80`} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        );
        
      case 'line':
      default:
        return (
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              dy={10}
            />
            <YAxis 
              tickFormatter={formatYAxis} 
              tick={{ fontSize: 12 }} 
              tickLine={false}
              axisLine={false}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          </LineChart>
        );
    }
  };

  return (
    <div className={cn("glass-card p-6 rounded-2xl transition-all duration-300 hover:shadow-md", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <div className="flex items-center space-x-1 bg-muted/50 backdrop-blur-sm rounded-lg p-1">
          {(['line', 'area', 'bar', 'pie'] as const).map((type) => (
            <button
              key={type}
              className={cn(
                "p-1.5 rounded-md transition-all duration-200",
                chartType === type 
                  ? "bg-white dark:bg-gray-800 shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
              )}
              onClick={() => setChartType(type)}
              title={`Switch to ${type} chart`}
            >
              {type === 'line' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18"></path>
                  <path d="m19 9-5 5-4-4-3 3"></path>
                </svg>
              )}
              {type === 'area' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18"></path>
                  <path d="M3 15l6-6 4 4 8-8v12H3z"></path>
                </svg>
              )}
              {type === 'bar' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                  <line x1="3" y1="20" x2="21" y2="20"></line>
                </svg>
              )}
              {type === 'pie' && (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                  <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartContainer;
