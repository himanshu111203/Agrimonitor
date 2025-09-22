import { useEffect } from "react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious,
  type CarouselApi 
} from "@/components/ui/carousel";
import { useState } from "react";
import agricultureFarm1 from "@/assets/agriculture-farm-1.jpg";
import agricultureFarm2 from "@/assets/agriculture-farm-2.jpg";
import droneAgriculture3 from "@/assets/drone-agriculture-3.jpg";
import agricultureField4 from "@/assets/agriculture-field-4.jpg";
import dronePrecisionFarming from "@/assets/drone-precision-farming.jpg";
import sustainableFarmGreen from "@/assets/sustainable-farm-green.jpg";

const HeroCarousel = () => {
  const [api, setApi] = useState<CarouselApi>();

  const images = [
    { src: agricultureFarm1, alt: "Modern agriculture farm with green crops" },
    { src: agricultureFarm2, alt: "Sustainable farming practices" },
    { src: droneAgriculture3, alt: "Drone monitoring agricultural fields" },
    { src: agricultureField4, alt: "Precision agriculture technology" },
    { src: dronePrecisionFarming, alt: "Precision farming drone over crops" },
    { src: sustainableFarmGreen, alt: "Sustainable green agriculture" },
  ];

  useEffect(() => {
    if (!api) {
      return;
    }

    const autoplay = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(autoplay);
  }, [api]);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full h-full"
      >
        <CarouselContent className="h-full">
          {images.map((image, index) => (
            <CarouselItem key={index} className="h-full">
              <div 
                className="w-full h-full bg-cover bg-center transition-all duration-700 ease-in-out"
                style={{ backgroundImage: `url(${image.src})` }}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 border-white/30 hover:bg-black/50 text-white" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 border-white/30 hover:bg-black/50 text-white" />
      </Carousel>
    </div>
  );
};

export default HeroCarousel;
