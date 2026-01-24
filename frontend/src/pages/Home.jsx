import HeroSlider from "../components/home/HeroSlider";
import SmartSearch from "../components/ai/SmartSearch";
import CategorySlider from "../components/home/CategorySlider";
import RecommendationSlider from "../components/ai/RecommendationSlider";

const Home = () => {
  return (
    <div className="pt-8 bg-gray-100">
      
      <HeroSlider />

      {/* Smart Search */}
      <div className="relative z-10 -mt-12">
        <div className="max-w-3xl mx-auto px-4">
          <SmartSearch />
        </div>
      </div>

      {/* Category Slider */}
      <CategorySlider />

      {/* Recommendations */}
      <RecommendationSlider />
    </div>
  );
};

export default Home;
