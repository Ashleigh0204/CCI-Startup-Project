import { useEffect, useMemo, useState } from "react";
import Container from "../components/Container/Container";
import ContainerContent from "../components/Container/ContainerContent";
import ContainerTitle from "../components/Container/ContainerTitle";
import Budget from "./Budget";
import RestaurantView from "./RestaurantView";
import FilterBar from "../components/FilterBar";

export default function Index() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // filter state
    const [searchText, setSearchText] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedKeyword, setSelectedKeyword] = useState("");

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError(null);

        fetch("/api/get_restaurants")
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

    return (
        <div className="grid grid-cols-2">
            <Container className="max-h-[calc(100vh-11rem)] overflow-y-auto">
                <ContainerTitle>Restaurants</ContainerTitle>
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

                    {loading && <p>Loading restaurants…</p>}
                    {error && <p className="text-red-600">Failed to load restaurants: {error}</p>}

                    {!loading && !error &&
                        filtered.map((restaurant) => (
                            <RestaurantView
                                key={restaurant._id || restaurant.id || restaurant.name}
                                title={restaurant.name}
                                description={restaurant.description}
                                isOpen={restaurant.isOpen}
                                kwords={restaurant.keywords || []}
                                nextTime={restaurant.nextTime || "10:00"}
                            />
                        ))}
                </ContainerContent>
            </Container>

            <div className="grid grid-rows-2">
                <Container className="max-h-60">
                    <ContainerTitle>Budget</ContainerTitle>
                    <ContainerContent>
                        <Budget spent={3.04} budget={20.0} timeUnit="week" />
                    </ContainerContent>
                </Container>
                <Container className="max-h-40">
                    <ContainerTitle>Recommendations</ContainerTitle>
                    <ContainerContent>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus voluptates sed perferendis! Voluptatem, velit reprehenderit. Quo ab ullam quisquam, earum perferendis dolorum sed provident quidem. Ipsa nam adipisci odio suscipit?
                    </ContainerContent>
                </Container>
            </div>
        </div>
    );
}