import HeroSlider from "../components/home/HeroSlider";
import CategorySlider from "../components/home/CategorySlider";
import RecommendationSlider from "../components/ai/RecommendationSlider";

const Home = () => {
  return (
    <div className="pt-0 bg-gray-100">

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