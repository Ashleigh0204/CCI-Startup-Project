import Container from "../components/Container/Container";
import ContainerContent from "../components/Container/ContainerContent";
import ContainerTitle from "../components/Container/ContainerTitle";
import RestaurantView from "./RestaurantView";

export default function Index() {
  ///TODO replace with API call
let restaurantData = 
    [
    {
        name: 'Crown Restaurant',
        description: 'Fine dining with excellent service and premium steaks',
        keywords: ['fine dining', 'upscale', 'steak', 'romantic'],
        isOpen: true
    },
    {
        name: 'Wendy\'s',
        description: 'Fast food burgers and fries with fresh ingredients',
        keywords: ['fast food', 'burgers', 'fries', 'casual'],
        isOpen: false
    },
    {
        name: 'Chick-fil-A',
        description: 'Chicken sandwiches and nuggets with friendly service',
        keywords: ['chicken', 'sandwiches', 'nuggets', 'family-friendly'],
        isOpen: true
    },
    {
        name: 'Chick-fil-A',
        description: 'Chicken sandwiches and nuggets with friendly service',
        keywords: ['chicken', 'sandwiches', 'nuggets', 'family-friendly'],
        isOpen: true
    }]
    
    //sort data
    restaurantData = restaurantData.sort((a,b) => b.isOpen-a.isOpen)


    return (
        <Container className="max-h-[calc(100vh-11rem)] overflow-y-auto">
            <ContainerTitle>
                Restaurants
            </ContainerTitle>
            <ContainerContent>
                {restaurantData.map(restaurant => 
                    <RestaurantView title={restaurant.name} description={restaurant.description} isOpen={restaurant.isOpen} kwords={restaurant.keywords} nextTime={'10:00'}/>
                )}
            </ContainerContent>
        </Container>
    );
}