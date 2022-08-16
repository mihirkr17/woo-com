import electronicsImage from "../Images/electronics.png";
import fashion from "../Images/fashion.png";
import menClothing from "../Images/men-clothing.png";

export const newCategory = [
   {
      id: 1,
      category: "fashion",
      img: fashion,
      sub_category_items: [
         {
            id: 1,
            sub_category: "jewelry",
            second_category_items: ["diamond-jewelry"]
         },
         {
            id: 2,
            sub_category: "fashion-accessories",
            second_category_items: ["sun-glass", "backpack-and-side-bag"]
         }
      ],

   },
   {
      id: 2,
      category: "electronics",
      img: electronicsImage,
      sub_category_items: [
         {
            id: 1,
            sub_category: "mobile-accessories",
            second_category_items: [
               "headphone-earphone",
               "data-cable-charger",
               "power-bank",
               "back-cover", "screen-protector", "mobile-holders",
               "others"
            ]
         },
         {
            id: 2,
            sub_category: "computer-accessories",
            second_category_items: [
               "memory", "hard-disk", "pen-drive",
               "mouse-keyboard"
            ]
         }
      ],
   }, {
      id: 3,
      category: "men-clothing",
      img: menClothing,
      sub_category_items: [
         {
            id: 1,
            sub_category: "t-shirt-and-polo",
            second_category_items: [
               "stylish-t-shirts", "stripe-polo", "colorful-polo", "couple-t-shirts"
            ]
         },
         {
            id: 2,
            sub_category: "shirt-punjabi-blazer",
            second_category_items: [
               "shirt-collection", "punjabi", "katua-and-fotua", "blazer"
            ]
         }
      ],
   },
   {
      id: 4,
      category: "women-clothing",
      img: menClothing,
      sub_category_items: [
         {
            id: 1,
            sub_category: "modern-and-western",
            second_category_items: [
               "t-shirts", "tops", "leggings", "kurti-single-kamiz"
            ]
         },
         {
            id: 2,
            sub_category: "winter-dress",
            second_category_items: [
               "punjabi", "katua-and-fotua", "blazer"
            ]
         }
      ],
   }
]