export const slugMaker = (string) => {
   return string.toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '');
}

export const averageRating = (rating) => {
   let weightVal = 0;
   let countValue = 0;
   rating && rating.length > 0 && rating.forEach(rat => {
      const multiWeight = parseInt(rat?.weight) * parseInt(rat?.count);
      weightVal += multiWeight;
      countValue += rat?.count;
   });
   const ava = weightVal / countValue;
   const average = parseFloat(ava.toFixed(2));
   return average;
}