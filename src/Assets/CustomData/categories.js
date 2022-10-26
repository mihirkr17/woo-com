import electronicsImage from "../Images/electronics.png";
import fashion from "../Images/fashion.png";
import menClothing from "../Images/men-clothing.png";

export const newCategory = [
   // {
   //    id: 1,
   //    category: "fashion",
   //    img: fashion,
   //    sub_category_items: [
   //       {
   //          id: 1,
   //          sub_category: "jewelry",
   //          post_category_items: ["diamond-jewelry"]
   //       },
   //       {
   //          id: 2,
   //          sub_category: "fashion-accessories",
   //          post_category_items: ["sun-glass", "backpack-and-side-bag"]
   //       }
   //    ],

   // },
   // {
   //    id: 2,
   //    category: "electronics",
   //    img: electronicsImage,
   //    sub_category_items: [
   //       {
   //          id: 1,
   //          sub_category: "mobile-accessories",
   //          post_category_items: [
   //             "headphone-earphone",
   //             "data-cable-charger",
   //             "power-bank",
   //             "back-cover", "screen-protector", "mobile-holders",
   //             "others"
   //          ],
   //          attr: {
   //             material: ['iron', 'silver', 'wood', 'plywood', 'gold']
   //          }
   //       },
   //       {
   //          id: 2,
   //          sub_category: "computer-accessories",
   //          post_category_items: [
   //             "memory", "hard-disk", "pen-drive",
   //             "mouse-keyboard"
   //          ],
   //          attr: {
   //             material: ['iron', 'silver', 'wood', 'plywood', 'gold', 'plastic']
   //          }
   //       }
   //    ],
   // },

   {
      id: 3,
      category: "men-clothing",
      img: menClothing,
      sub_category_items: [
         {
            id: 1,
            name: "top-wear",
            post_category_items: [
               {
                  name: 't-shirt',
                  attribute: {
                     sizes: ['S', 'M', 'L', 'XXL', 'XS'],
                     fabrics: ['lace', 'net', 'denim', 'nylon', 'pure-cotton', 'muslin', 'latex'],
                     colors: [
                        { name: 'red', hex: '#ff0000' },
                        { name: 'orange', hex: '#ffa500' },
                        { name: 'green', hex: '#008000' },
                        { name: 'blue', hex: '#0000ff' },
                        { name: 'white', hex: '#ffffff' },
                        { name: 'black', hex: '#000000' }
                     ],
                     types: ['round-neck'],
                     patterns: ['solid', 'thin', 'stripped', 'printed'],
                     idealFor: ['men', 'women', 'couple'],
                     sleeve: ['sleeveless', 'layered-sleeve', 'short-sleeve', 'half-sleeve', 'full-sleeve', '3/4-sleeve', 'roll-up-sleeve'],
                     fabricCares: ['regular-machine-wash', 'reverse-and-dry', 'dry-and-shade', 'do-not-tumble-dry', 'do-not-dry-clean', 'dry-clean-only'],
                     fit: ['regular', 'slim', 'loose', 'boxy', 'compression'],
                     suiteFor: ['maternity-wear', 'western-wear'],
                     sportType: ['football', 'cricket', 'N/A']
                  }
               }

            ],
         },
         {
            id: 2,
            name: "bottom-wear",
            post_category_items: [
               {
                  name: 'pants',
                  attribute: {
                     sizes: ['S', 'M', 'L', 'XXL', 'XS'],
                     fabrics: ['lace', 'net', 'denim', 'nylon', 'pure-cotton', 'muslin', 'latex'],
                     colors: [
                        { name: 'red', hex: '#ff0000' },
                        { name: 'orange', hex: '#ffa500' },
                        { name: 'green', hex: '#008000' },
                        { name: 'blue', hex: '#0000ff' },
                        { name: 'white', hex: '#ffffff' },
                        { name: 'black', hex: '#000000' }
                     ],
                     types: ['round-neck'],
                     patterns: ['solid', 'thin', 'stripped', 'printed'],
                     idealFor: ['men', 'women', 'couple'],
                     Sleeves: ['sleeveless', 'layered-sleeve', 'short-sleeve', 'half-sleeve', 'full-sleeve', '3/4-sleeve', 'roll-up-sleeve'],
                     fabricCares: ['regular-machine-wash', 'reverse-and-dry', 'dry-and-shade', 'do-not-tumble-dry', 'do-not-dry-clean', 'dry-clean-only'],
                     fit: ['regular', 'slim', 'loose', 'boxy', 'compression'],
                     suiteFor: ['maternity-wear', 'western-wear']
                  }
               }
            ],

         }
      ],
   },

   // {
   //    id: 4,
   //    category: "women-clothing",
   //    img: menClothing,
   //    sub_category_items: [
   //       {
   //          id: 1,
   //          sub_category: "modern-and-western",
   //          post_category_items: [
   //             "t-shirts", "tops", "leggings", "kurti-single-kamiz"
   //          ],
   //          attr: {
   //             size: [
   //                { name: "S", unit: 39 },
   //                { name: "M", unit: 40 },
   //                { name: "L", unit: 42 },
   //                { name: "XL", unit: 44 },
   //                { name: "XXL", unit: 46 }
   //             ],
   //             colors: [
   //                { name: 'red', hex: '#ff0000' },
   //                { name: 'orange', hex: '#ffa500' },
   //                { name: 'green', hex: '#008000' },
   //                { name: 'blue', hex: '#0000ff' },
   //                { name: 'white', hex: '#ffffff' },
   //                { name: 'black', hex: '#000000' }
   //             ]
   //          }
   //       },
   //       {
   //          id: 2,
   //          sub_category: "winter-dress",
   //          post_category_items: [
   //             "punjabi", "katua-and-fotua", "blazer"
   //          ],
   //          attr: {
   //             size: [
   //                { name: "S", unit: 39 },
   //                { name: "M", unit: 40 },
   //                { name: "L", unit: 42 },
   //                { name: "XL", unit: 44 },
   //                { name: "XXL", unit: 46 }
   //             ],
   //             colors: [
   //                { name: 'red', hex: '#ff0000' },
   //                { name: 'orange', hex: '#ffa500' },
   //                { name: 'green', hex: '#008000' },
   //                { name: 'blue', hex: '#0000ff' },
   //                { name: 'white', hex: '#ffffff' },
   //                { name: 'black', hex: '#000000' }
   //             ]
   //          }
   //       }
   //    ],
   // }
]