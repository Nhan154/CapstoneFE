import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getRooms } from '@/services/api';
import Layout from '@/components/layout/Layout';
import PropertyCard from '@/components/properties/PropertyCard';
import { Room } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';

const SearchProperties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialKeyword = searchParams.get('keyword') || '';
  
  const [properties, setProperties] = useState<Room[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialKeyword);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await getRooms();
        if (response.statusCode === 200) {
          setProperties(response.content);
          filterProperties(response.content, initialKeyword);
        } else {
          setError('Failed to load properties');
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        setError('Failed to load properties. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperties();
  }, [initialKeyword]);
  
  const filterProperties = (propertiesToFilter: Room[], term: string) => {
    if (!term.trim()) {
      setFilteredProperties(propertiesToFilter);
      return;
    }
    
    const normalizedTerm = term.toLowerCase();
    
    const filtered = propertiesToFilter.filter(property => 
      property.tenPhong.toLowerCase().includes(normalizedTerm) ||
      property.moTa.toLowerCase().includes(normalizedTerm)
    );
    
    setFilteredProperties(filtered);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterProperties(properties, searchTerm);
    setSearchParams({ keyword: searchTerm });
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Search Results</h1>
          
          <form 
            onSubmit={handleSearch}
            className="flex gap-2 max-w-xl"
          >
            <Input
              type="text"
              placeholder="Search by property name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        ) : filteredProperties.length > 0 ? (
          <>
            <p className="mb-4">{filteredProperties.length} properties found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl mb-2">No properties found matching your search.</p>
            <p className="text-muted-foreground">Try adjusting your search terms or browse all available properties.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchProperties;