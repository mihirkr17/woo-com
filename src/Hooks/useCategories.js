import { useEffect, useState } from "react";

export const useCategories = (category, dataCategory) => {
   const [subCategories, setSubCategories] = useState([]);
   const categories = ["fashion", "electronics"];

   useEffect(() => {

      const fashionCategories = ["men-fashion", "women-fashion", "jewelry", "accessories"];
      const electronicCategories = ["mobile-parts", "laptop-parts", "desktop-parts", "home-accessories"];

      let subCategories = (category || dataCategory) === "fashion" ? fashionCategories :
         (category || dataCategory) === "electronics" ? electronicCategories : [];

      return setSubCategories(subCategories);
   }, [category, dataCategory]);

   return { categories, subCategories }
}