import { useEffect, useState } from "react";

export const useCategories = (category, dataCategory) => {
   const [subCategories, setSubCategories] = useState([]);
   const categories = ["fashion", "electronics"];

   useEffect(() => {

      const fashionCategories = ["men's-clothing", "women's-clothing", "jewelry"];
      const electronicCategories = ["mobile-parts", "laptop-parts", "desktop-parts"];

      let subCategories = (category || dataCategory) === "fashion" ? fashionCategories :
         (category || dataCategory) === "electronics" ? electronicCategories : [];

      return setSubCategories(subCategories);
   }, [category, dataCategory]);

   return { categories, subCategories }
}