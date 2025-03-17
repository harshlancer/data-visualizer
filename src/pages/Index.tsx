
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, Users, AlertCircle, Heart } from 'lucide-react';
import Layout from '@/components/Layout';
import DataCard from '@/components/DataCard';
import ChartContainer from '@/components/ChartContainer';
import DataSelector from '@/components/DataSelector';
import CountrySelector from '@/components/CountrySelector';
import { fetchAllCountriesData, fetchCountryData, fetchGlobalData, fetchHistoricalData, formatHistoricalData } from '@/services/api';
import { CovidData, DataType, DataTypeOption } from '@/types';

const dataTypeOptions: DataTypeOption[] = [
  { value: 'cases', label: 'Cases', color: '#3B82F6' }, // blue
  { value: 'deaths', label: 'Deaths', color: '#EF4444' }, // red
  { value: 'recovered', label: 'Recovered', color: '#10B981' }, // green
  { value: 'active', label: 'Active', color: '#F59E0B' }, // yellow
];

const dataTypeColors = {
  cases: '#3B82F6',
  deaths: '#EF4444',
  recovered: '#10B981',
  active: '#F59E0B',
};

const Index = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('Global');
  const [dataType, setDataType] = useState<DataType>('cases');
  const [historyDays, setHistoryDays] = useState<number>(30);

  // Fetch all countries data
  const { 
    data: countriesData,
    isLoading: isLoadingCountries
  } = useQuery({
    queryKey: ['countries'],
    queryFn: fetchAllCountriesData,
  });

  // Fetch global or country-specific data
  const { 
    data: currentData,
    isLoading: isLoadingCurrent
  } = useQuery({
    queryKey: ['currentData', selectedCountry],
    queryFn: () => selectedCountry === 'Global' ? fetchGlobalData() : fetchCountryData(selectedCountry),
  });

  // Fetch historical data
  const { 
    data: historyData,
    isLoading: isLoadingHistory
  } = useQuery({
    queryKey: ['history', selectedCountry, historyDays],
    queryFn: () => fetchHistoricalData(historyDays, selectedCountry === 'Global' ? 'all' : selectedCountry),
  });

  // Format chart data
  const chartData = historyData && formatHistoricalData(
    historyData, 
    // The API doesn't provide historical active cases, so we only use cases, deaths, and recovered
    dataType === 'active' ? 'cases' : dataType
  );

  return (
    <Layout>
      <div className="flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight animate-fade-in">
              COVID-19 Dashboard
            </h1>
            <p className="text-muted-foreground animate-fade-in animation-delay-200">
              Interactive visualization of coronavirus data worldwide
            </p>
          </div>
          
          <div className="w-full md:w-auto animate-fade-in animation-delay-300">
            <CountrySelector
              countries={countriesData || []}
              selectedCountry={selectedCountry}
              onSelect={setSelectedCountry}
              isLoading={isLoadingCountries}
              className="w-full md:w-[250px]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <DataCard
            title="Total Cases"
            value={currentData?.cases || 0}
            delta={currentData?.todayCases}
            icon={<Activity className="w-4 h-4" />}
            color="blue"
            isLoading={isLoadingCurrent}
            className="animate-slide-up animation-delay-100"
          />
          
          <DataCard
            title="Active Cases"
            value={currentData?.active || 0}
            icon={<Users className="w-4 h-4" />}
            color="yellow"
            isLoading={isLoadingCurrent}
            className="animate-slide-up animation-delay-200"
          />
          
          <DataCard
            title="Deaths"
            value={currentData?.deaths || 0}
            delta={currentData?.todayDeaths}
            icon={<AlertCircle className="w-4 h-4" />}
            color="red"
            isLoading={isLoadingCurrent}
            className="animate-slide-up animation-delay-300"
          />
          
          <DataCard
            title="Recovered"
            value={currentData?.recovered || 0}
            delta={currentData?.todayRecovered}
            icon={<Heart className="w-4 h-4" />}
            color="green"
            isLoading={isLoadingCurrent}
            className="animate-slide-up animation-delay-400"
          />
        </div>

        <div className="mb-8 animate-scale-in animation-delay-500">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold tracking-tight">
              Historical Data
            </h2>
            <DataSelector
              options={dataTypeOptions}
              value={dataType}
              onChange={(value) => setDataType(value as DataType)}
            />
          </div>
          
          <ChartContainer
            data={chartData || []}
            title={`${dataType.charAt(0).toUpperCase() + dataType.slice(1)} over time`}
            color={dataTypeColors[dataType]}
            type="area"
            isLoading={isLoadingHistory}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-scale-in animation-delay-600">
          <ChartContainer
            data={
              countriesData 
                ? countriesData
                    .sort((a, b) => b[dataType] - a[dataType])
                    .slice(0, 10)
                    .map(country => ({
                      name: country.country,
                      value: country[dataType]
                    }))
                : []
            }
            title={`Top 10 Countries by ${dataType.charAt(0).toUpperCase() + dataType.slice(1)}`}
            color={dataTypeColors[dataType]}
            type="bar"
            isLoading={isLoadingCountries}
          />
          
          <ChartContainer
            data={
              currentData
                ? [
                    { name: 'Cases', value: currentData.cases },
                    { name: 'Deaths', value: currentData.deaths },
                    { name: 'Recovered', value: currentData.recovered },
                    { name: 'Active', value: currentData.active },
                  ]
                : []
            }
            title={`${selectedCountry} Summary`}
            color="#6366F1"
            type="pie"
            isLoading={isLoadingCurrent}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
