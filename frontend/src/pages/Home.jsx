import HeroSlider from "../components/home/HeroSlider";
import SmartSearch from "../components/ai/SmartSearch";
import CategorySlider from "../components/home/CategorySlider";
import RecommendationSlider from "../components/ai/RecommendationSlider";

const Home = () => {
  return (
    <div className="pt-0 bg-gray-100">

      {/* Smart Search */}
      <SmartSearch />

      {/* Hero Slider */}
      <HeroSlider />

      {/* Category Slider */}
      <CategorySlider />

      {/* AI Recommendations */}
      <RecommendationSlider />

    </div>
  );
};

export default Home;