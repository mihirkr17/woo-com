import React, { useEffect, useState } from 'react';
import { addressBook } from '../Assets/CustomData/addressBook';

const useAddress = ({ oldAddrs }) => {
   const [newDivision, setNewDivision] = useState({});
   const [newCity, setNewCity] = useState({});
   const [address, setAddress] = useState({});

   useEffect(() => {
      if (oldAddrs) {
         setAddress(oldAddrs);
      } else {
         setAddress({
            name: "",
            division: "",
            city: "",
            area: "",
            area_type: "",
            landmark: "",
            phone_number: 0,
            postal_code: 0,
            default_shipping_address: false
         })
      }

   }, [oldAddrs]);

   useEffect(() => {
      setNewDivision(Array.isArray(addressBook?.division) && addressBook?.division.find(e => e.name === address?.division));
      setNewCity(Array.isArray(newDivision?.city) && newDivision?.city.find(e => e?.name === address?.city))
   }, [address?.division, address?.city, newDivision?.city]);


   return (
      <div>

      </div>
   );
};

export default useAddress;