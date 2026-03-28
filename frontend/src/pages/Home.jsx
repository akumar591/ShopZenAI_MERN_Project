import HeroSlider from "../components/home/HeroSlider";
import CategorySlider from "../components/home/CategorySlider";
import RecommendationSlider from "../components/ai/RecommendationSlider";
import LatestProducts from "../components/home/LatestProducts";


const Home = () => {
  return (
    <div className="pt-0 bg-gray-100">

      {/* HERO SECTION */}
      <HeroSlider />

      {/* CATEGORY SECTION */}
      <CategorySlider />

       {/* 🤖 AI RECOMMENDATIONS */}
      <RecommendationSlider />

      {/* 🔥 LATEST PRODUCTS */}
      <LatestProducts/>

    </div>
  );
};

export default Home;