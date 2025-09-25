import axios from "axios";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/Components/ui/carousel";
import { Link } from "react-router-dom";

const Cuisines = () => {
  const [cuisines, setCuisines] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/v1/cuisines`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        const flatCuisines = res.data.data.map((item) => ({
          ...item.attributes,
        }));
        setCuisines(flatCuisines);
        console.log("Cuisines Fetched Successfully", flatCuisines);
      })
      .catch((err) => {
        console.error("Error Fetching Cuisines", err);
      });
  }, []);

  return (
    <section className="Cuisines flex flex-col gap-4">
      <div>
        <p className="text-xl font-bold">Browse by cuisine</p>
      </div>
      <div>
        <Carousel opts={{ align: "start", slidesToScroll: 1 }}>
          <CarouselContent>
            {cuisines.map((cuisine) => (
              <CarouselItem key={cuisine.id} className="basis-1/8">
                <Link to={``}>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-32 h-32 bg-gray-100 rounded-full overflow-hidden relative">
                      {cuisine.photo ? (
                        <img
                          src={cuisine.photo}
                          alt={cuisine.name}
                          className="w-full h-full object-cover transform transition-transform duration-300 hover:-translate-y-2"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <p>No IMG</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-center font-light">{cuisine.name}</p>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
};

export default Cuisines;
