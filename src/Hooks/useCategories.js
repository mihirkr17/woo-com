import { useEffect, useState } from "react";

const Categories = ["fashion", "electronics", "men-clothing"];

const electronicsCategories = {
   "mobile-accessories": [
      "headphone-earphone",
      "data-cable-charger",
      "power-bank",
      "back-cover", "screen-protector",
      "others"
   ],
   "computer-accessories": [
      "memory", "hard-disk", "pen-drive",
      "mouse-keyboard"
   ]
}

const fashionCategories = {
   "jewelry": [
      "diamond-jewelry"
   ],
   "fashion-accessories": [
      "sun-glass", "backpack-and-side-bag"
   ]
};

const menCategories = {
   "t-shirt-and-polo" : [
      "stylish-t-shirts", "stripe-polo", "colorful-polo", "couple-t-shirts"
   ],
   "shirt-punjabi-blazer" : [
      "shirt-collection", "punjabi-katua-and-fotua", "blazer"
   ]
}

export const useCategories = (ctg) => {
   const [subCategories, setSubCategories] = useState([]);
   const [secondCategories, setSecondCategories] = useState([]);

   useEffect(() => {
      const initCategories = (names, values) => {

         if (ctg.category === names) {

            let div = Object.keys(values);

            if (div) {

               setSubCategories(div);
               let div2 = values[ctg.sub_category];

               if (div2) {
                  setSecondCategories(div2);
               } else {
                  setSecondCategories([]);
               }
            }

         } else {
            setSubCategories([]);
            setSecondCategories([]);
         }
      }

      if (ctg.category === "fashion") {
         initCategories("fashion", fashionCategories);
      } else if (ctg.category === "electronics") {
         initCategories("electronics", electronicsCategories);
      } else if (ctg.category === "men-clothing") {
         initCategories("men-clothing", menCategories);
      } else {
         initCategories("", {});
      }
   }, [ctg]);

   return { subCategories, secondCategories, Categories }
}




// import { useEffect, useState } from "react";

// export const useCategories = (category, dataCategory) => {
//    const [subCategories, setSubCategories] = useState([]);
//    const categories = ["fashion", "electronics"];

//    useEffect(() => {

//       const fashionCategories = ["men-fashion", "women-fashion", "jewelry", "accessories"];
//       const electronicCategories = ["mobile-parts", "laptop-parts", "desktop-parts", "home-accessories"];

//       let subCategories = (category || dataCategory) === "fashion" ? fashionCategories :
//          (category || dataCategory) === "electronics" ? electronicCategories : [];

//       return setSubCategories(subCategories);
//    }, [category, dataCategory]);

//    return { categories, subCategories }
// }