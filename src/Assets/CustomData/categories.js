import electronicsImage from "../Images/electronics.png";
import fashion from "../Images/fashion.png";
import menClothing from "../Images/men-clothing.png";

export const newCategory = [
   {
      id: 1,
      category: "fashion",
      img: fashion,
      sc: [
         {
            id: 1,
            sub_category: "jewelry",
            sc_item: ["diamond-jewelry"]
         },
         {
            id: 2,
            sub_category: "fashion-accessories",
            sc_item: ["sun-glass", "backpack-and-side-bag"]
         }
      ],

   },
   {
      id: 2,
      category: "electronics",
      img: electronicsImage,
      sc: [
         {
            id: 1,
            sub_category: "mobile-accessories",
            sc_item: [
               "headphone-earphone",
               "data-cable-charger",
               "power-bank",
               "back-cover", "screen-protector",
               "others"
            ]
         },
         {
            id: 2,
            sub_category: "computer-accessories",
            sc_item: [
               "memory", "hard-disk", "pen-drive",
               "mouse-keyboard"
            ]
         }
      ],
   }, {
      id: 3,
      category: "men-clothing",
      img: menClothing,
      sc: [
         {
            id: 1,
            sub_category: "t-shirt-and-polo",
            sc_item: [
               "stylish-t-shirts", "stripe-polo", "colorful-polo", "couple-t-shirts"
            ]
         },
         {
            id: 2,
            sub_category: "shirt-punjabi-blazer",
            sc_item: [
               "shirt-collection", "punjabi-katua-and-fotua", "blazer"
            ]
         }
      ],
   }
]