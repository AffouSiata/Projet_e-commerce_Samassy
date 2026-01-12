import Header from '@/components/Header';
import HeroSlider from '@/components/Hero';
import Categories from '@/components/Categories';
import FeaturedProducts from '@/components/FeaturedProducts';
import BestSellers from '@/components/BestSellers';
import Advantages from '@/components/Advantages';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Header />
      <HeroSlider />
      <Categories />
      <FeaturedProducts />
      <BestSellers />
      <Advantages />
      <Testimonials />
      <Footer />
    </main>
  );
}
