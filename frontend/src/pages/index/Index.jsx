import Container from "../../components/Container/Container.jsx";
import ContainerContent from "../../components/Container/ContainerContent.jsx";
import ContainerTitle from "../../components/Container/ContainerTitle.jsx";
import Budget from "./Budget/Budget.jsx";
import RestaurantView from "./RestaurantView.jsx";  
import FilterBar from "../../components/FilterBar.jsx";
import Recipe from "./Recipe/Recipe.jsx";
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

  const convertTo12Hour = (time24) => {
    if (!time24 || time24 === 'closed') return time24;
    
    // Handle 24:00 as midnight
    if (time24 === '24:00') {
      return '12:00 AM';
    }
    
    const [hours, minutes] = time24.split(':');
    const hour24 = parseInt(hours, 10);
    const minute = minutes || '00';
    
    if (hour24 === 0) {
      return `12:${minute} AM`;
    } else if (hour24 < 12) {
      return `${hour24}:${minute} AM`;
    } else if (hour24 === 12) {
      return `12:${minute} PM`;
    } else {
      return `${hour24 - 12}:${minute} PM`;
    }
  };

  // Get closing time for today or opening time if closed
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
    
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    const dayPrefix = dayMap[today];
    const openTime = restaurant[`${dayPrefix}open`];
    const closeTime = restaurant[`${dayPrefix}close`];
    
    // If restaurant is currently open, show closing time
    if (restaurant.isOpen) {
      const timeToReturn = closeTime || '22:00';
      return convertTo12Hour(timeToReturn);
    }
    
    // If restaurant is closed, find next opening time
    const currentTime = new Date().getHours() * 100 + new Date().getMinutes();
    
    // Check if it opens later today
    if (openTime && openTime !== 'closed') {
      const openTimeNum = parseInt(openTime.replace(':', ''));
      if (currentTime < openTimeNum) {
        return convertTo12Hour(openTime);
      }
    }
    
    // Find next day it's open
    for (let i = 1; i <= 7; i++) {
      const nextDay = (today + i) % 7;
      const nextDayPrefix = dayMap[nextDay];
      const nextOpenTime = restaurant[`${nextDayPrefix}open`];
      
      if (nextOpenTime && nextOpenTime !== 'closed') {
        const dayName = dayNames[nextDay];
        const time = convertTo12Hour(nextOpenTime);
        return `${time} on ${dayName}`;
      }
    }
    
    // Fallback
    return 'Closed';
  };

  // Sample recipe data for recommendations
  const recipe = {
    "name": "Spicy Grilled Chicken & Quinoa Bowl",
    "ingredients":[{"name": "Chicken Breast", "amount":"2 lbs (4 breasts)", "price":8}, {"name":"Quinoa","amount":"1 cup (uncooked)", "price":3}, {"name":"Black Beans (canned)", "amount":"1 can (15 oz), rinsed and drained", "price":1}],
    "steps": [
      "Step 1: Prepare the Chicken: In a bowl, mix together 1 tbsp olive oil, chili powder, cumin, garlic powder, paprika, salt, and pepper. Rub the spice mixture all over the chicken breasts.",
      "Step 2: Grill the Chicken: Preheat your grill to medium-high heat. Grill the chicken breasts for about 6-8 minutes per side, or until cooked through and the internal temperature reaches 165°F (74°C). Let the chicken rest for 5 minutes before slicing or dicing.",
      "Step 3: Cook the Quinoa: Rinse the quinoa in a fine-mesh sieve. In a saucepan, combine the quinoa with 2 cups of water or chicken broth. Bring to a boil, then reduce heat and simmer for 15 minutes, or until the quinoa is cooked and the liquid is absorbed. Fluff with a fork.",
      "Step 4: Prepare the Black Bean & Corn Salsa: In a bowl, combine the rinsed and drained black beans, frozen corn (no need to thaw), diced red onion, diced red bell pepper, minced jalapeño, and chopped cilantro.",
      "Step 5: Make the Lime Dressing: In a small bowl, whisk together the juice of 1 lime, 1 tbsp olive oil, a pinch of salt, and a pinch of pepper.",
      "Step 6: Assemble the Bowls: Divide the cooked quinoa among bowls. Top with the sliced or diced grilled chicken, black bean and corn salsa, and diced avocado. Drizzle with the lime dressing and garnish with extra cilantro and a lime wedge for squeezing.",
      "Step 7: Enjoy Outdoors! This dish is best enjoyed fresh and makes for a perfect outdoor meal."
    ],
    "totalCost": 21.8,
    "dietaryInfo": {
      "diet": "omnivore",
      "preferences": [
        "spicy food",
        "quick service",
        "outdoor seating"
      ],
      "allergens": [
        "None (Check ingredient labels for potential cross-contamination)"
      ]
    },
    "generatedFor": {
      "userId": "68f3e7d8d98e604dad78f110",
      "username": "john_doe"
    },
    "generatedAt": "2025-10-18T19:20:47.081Z",
    "summary": "Tender grilled chicken with quinoa and black beans, seasoned with Mediterranean spices. A healthy, protein-rich bowl perfect for outdoor dining."
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
                      <Recipe />
                  </ContainerContent>
              </Container>
          </div>
      </div>
  );
}