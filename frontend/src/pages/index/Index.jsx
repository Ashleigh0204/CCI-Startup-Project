import Container from "../components/Container/Container";
import ContainerContent from "../components/Container/ContainerContent";
import ContainerTitle from "../components/Container/ContainerTitle";
import Budget from "./Budget";
import RestaurantView from "./RestaurantView";
import FilterBar from "../components/FilterBar";
import { useState, useEffect, useMemo } from 'react';

export default function Index() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedKeyword, setSelectedKeyword] = useState("");

  useEffect(() => {
      let isMounted = true;
      setLoading(true);
      setError(null);

      fetch("http://127.0.0.1:8080/api/get_restaurants")
          .then((res) => {
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              return res.json();
          })
          .then((data) => {
              if (!isMounted) return;
              setRestaurants(data.data || []);
          })
          .catch((err) => {
              if (!isMounted) return;
              setError(err.message || "Failed to load restaurants");
          })
          .finally(() => {
              if (!isMounted) return;
              setLoading(false);
          });

      return () => {
          isMounted = false;
      };
  }, []);

  const availableKeywords = useMemo(() => {
      const kw = new Set();
      restaurants.forEach((r) => (r.keywords || []).forEach((k) => kw.add(k)));
      return Array.from(kw).sort();
  }, [restaurants]);

  const filtered = useMemo(() => {
      return (restaurants || [])
          .filter((r) => {
              if (selectedStatus === "open" && !r.isOpen) return false;
              if (selectedStatus === "closed" && r.isOpen) return false;
              if (selectedKeyword && !(r.keywords || []).includes(selectedKeyword)) return false;
              if (searchText) {
                  const q = searchText.toLowerCase();
                  if (!(
                      (r.name || "").toLowerCase().includes(q) ||
                      (r.description || "").toLowerCase().includes(q) ||
                      (r.keywords || []).some((k) => k.toLowerCase().includes(q))
                  )) return false;
              }
              return true;
          })
          .sort((a, b) => Number(b.isOpen) - Number(a.isOpen));
  }, [restaurants, searchText, selectedStatus, selectedKeyword]);

  // Get closing time for today
  const getClosingTime = (restaurant) => {
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayMap = {
      0: 'U', // Sunday
      1: 'M', // Monday
      2: 'T', // Tuesday
      3: 'W', // Wednesday
      4: 'R', // Thursday
      5: 'F', // Friday
      6: 'S'  // Saturday
    };
    
    const dayPrefix = dayMap[today];
    const closeTime = restaurant[`${dayPrefix}close`];
    
    // If closed today, return opening time for tomorrow
    if (closeTime === 'closed') {
      const tomorrow = (today + 1) % 7;
      const tomorrowPrefix = dayMap[tomorrow];
      return restaurant[`${tomorrowPrefix}open`] || '10:00';
    }
    
    return closeTime || '22:00';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading restaurants...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
      <div className="grid grid-cols-2">
          <Container className="max-h-[calc(100vh-11rem)] overflow-y-auto">
              <ContainerTitle>
                  Restaurants
              </ContainerTitle>
              <ContainerContent>
                  <FilterBar
                    searchText={searchText}
                    setSearchText={setSearchText}
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                    selectedKeyword={selectedKeyword}
                    setSelectedKeyword={setSelectedKeyword}
                    availableKeywords={availableKeywords}
                  />
                  {filtered.map(restaurant => 
                      <RestaurantView 
                          key={restaurant._id}
                          title={restaurant.name} 
                          description={restaurant.description} 
                          isOpen={restaurant.isOpen} 
                          kwords={restaurant.keywords} 
                          nextTime={getClosingTime(restaurant)}
                      />
                  )}
                  {filtered.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      No restaurants found matching your criteria.
                    </div>
                  )}
              </ContainerContent>
          </Container>
          <div className="flex flex-col h-full">
              <Container className="flex-1 mb-4">
                  <ContainerTitle>
                      Budget
                  </ContainerTitle>
                  <ContainerContent>
                      <Budget />
                  </ContainerContent>
              </Container>
              <Container className="flex-1">
                  <ContainerTitle>
                      Recommendations
                  </ContainerTitle>
                  <ContainerContent>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus voluptates sed perferendis! Voluptatem, velit reprehenderit. Quo ab ullam quisquam, earum perferendis dolorum sed provident quidem. Ipsa nam adipisci odio suscipit?
                  </ContainerContent>
              </Container>
          </div>
      </div>
  );
}