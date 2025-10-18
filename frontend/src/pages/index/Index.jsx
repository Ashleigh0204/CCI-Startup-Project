import Container from "../components/Container/Container";
import ContainerContent from "../components/Container/ContainerContent";
import ContainerTitle from "../components/Container/ContainerTitle";
import Budget from "./Budget/Budget";
import RestaurantView from "./RestaurantView";
import Recipe from "./Recipe/Recipe";

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

    const recipe = {
  "name": "Spicy Grilled Chicken & Quinoa Bowl",
  "ingredients":[{"name": "Chicken Breast", "amount":"2 lbs (4 breasts)", "price":8}, {"name":"Quinoa","amount":"1 cup (uncooked)", "price":3}, {"name":"Black Beans (canned)", "amount":"1 can (15 ox), rinsed and drained", "price":1}],
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
  "summary": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi cumque labore nobis aliquid eius error fugiat aliquam inventore quibusdam fuga quisquam asperiores nemo non ea, itaque blanditiis doloribus voluptatem! Accusamus?"
}
    
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
            <div className="grid grid-rows-2 auto-rows-min">
                <Container>
                    <ContainerTitle>
                        Budget
                    </ContainerTitle>
                    <ContainerContent>
                        <Budget spent={3.04} budget={20.00} timeUnit="week"/>
                    </ContainerContent>
                </Container>
                <Container>
                    <ContainerTitle>
                        Recommendations
                    </ContainerTitle>
                    <ContainerContent>
                        <Recipe recipe={recipe} />
                    </ContainerContent>
                </Container>
            </div>
        </div>
    );
}