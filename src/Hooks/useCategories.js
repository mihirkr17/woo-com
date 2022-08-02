import { useEffect, useState } from "react";

export const useCategories = (category, data = {}) => {
   const [categories, setCategories] = useState([]);
   const [subCategories, setSubCategories] = useState([]);

   useEffect(() => {
      const categories = ["fashion", "electronics"];
      const fashionCategories = ["men's-clothing", "women's-clothing", "jewelry"];
      const electronicCategories = ["mobile-parts", "laptop-parts", "desktop-parts"];
      let subCategories;

      if (data && category) {
         subCategories = category && data?.category === "fashion" ? fashionCategories : category && data?.category === "electronics" ? electronicCategories : []
      } else {
         subCategories = category === "fashion" ? fashionCategories : category === "electronics" ? electronicCategories : []
      }
     
      setCategories(categories);
      setSubCategories(subCategories);
   }, [category, data]);

   return { categories, subCategories }
}