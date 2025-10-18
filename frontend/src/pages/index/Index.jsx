import Container from "../components/Container/Container";
import ContainerContent from "../components/Container/ContainerContent";
import ContainerTitle from "../components/Container/ContainerTitle";
import Budget from "./Budget";
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
        <div className="grid grid-cols-2">
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
            <div className="grid grid-rows-2">
                <Container className="max-h-60">
                    <ContainerTitle>
                        Budget
                    </ContainerTitle>
                    <ContainerContent>
                        <Budget spent={3.04} budget={20.00} timeUnit="week"/>
                    </ContainerContent>
                </Container>
                <Container className="max-h-40">
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