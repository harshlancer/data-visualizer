
import { useState, useEffect, useRef } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, ChevronsUpDown, GlobeIcon } from 'lucide-react';
import { CovidData } from '@/types';
import { cn } from '@/lib/utils';

interface CountrySelectorProps {
  countries: CovidData[];
  selectedCountry: string;
  onSelect: (value: string) => void;
  isLoading?: boolean;
  className?: string;
}

const CountrySelector = ({
  countries,
  selectedCountry,
  onSelect,
  isLoading = false,
  className,
}: CountrySelectorProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [triggerWidth, setTriggerWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [open]);

  // Get the selected country data
  const selected = selectedCountry === 'Global' 
    ? { 
        country: 'Global',
        countryInfo: { flag: '' } 
      } 
    : countries.find(c => c.country === selectedCountry) || { 
        country: selectedCountry,
        countryInfo: { flag: '' } 
      };

  if (isLoading) {
    return (
      <div className={cn("skeleton-loading h-10 w-48 rounded-md", className)}></div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger ref={triggerRef} asChild>
        <button
          aria-expanded={open}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
            "hover:border-primary/50 hover:shadow-sm",
            className
          )}
        >
          {selected && (
            <div className="flex items-center gap-2 truncate">
              {selected.countryInfo?.flag ? (
                <img 
                  src={selected.countryInfo.flag} 
                  alt={`${selected.country} flag`} 
                  className="h-4 w-6 object-cover rounded-sm"
                />
              ) : (
                <GlobeIcon className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="truncate">{selected.country}</span>
            </div>
          )}
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="p-0 shadow-md" 
        align="start" 
        side="bottom" 
        style={{ width: triggerWidth }}
      >
        <Command>
          <CommandInput 
            placeholder="Search country..." 
            className="h-9"
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="h-80">
                <CommandItem
                  key="global"
                  value="Global"
                  onSelect={() => {
                    onSelect("Global");
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 px-2 py-1.5"
                >
                  <GlobeIcon className="h-4 w-4 text-muted-foreground" />
                  <span>Global</span>
                  {selectedCountry === "Global" && (
                    <Check className="h-4 w-4 ml-auto text-primary" />
                  )}
                </CommandItem>
                {countries.map((country) => (
                  <CommandItem
                    key={country.country}
                    value={country.country}
                    onSelect={() => {
                      onSelect(country.country);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 px-2 py-1.5"
                  >
                    {country.countryInfo?.flag ? (
                      <img 
                        src={country.countryInfo.flag} 
                        alt={`${country.country} flag`} 
                        className="h-4 w-6 object-cover rounded-sm"
                      />
                    ) : (
                      <div className="h-4 w-6 bg-muted rounded-sm" />
                    )}
                    <span>{country.country}</span>
                    {selectedCountry === country.country && (
                      <Check className="h-4 w-4 ml-auto text-primary" />
                    )}
                  </CommandItem>
                ))}
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CountrySelector;
