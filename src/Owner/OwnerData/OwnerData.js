import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from '../../App';
import useAuth from '../../Hooks/useAuth';


const OwnerData = () => {
   const user = useAuthUser();
   const { role } = useAuth(user);
   const navigate = useNavigate();

   useEffect(() => {
      if ((role && (role !== "owner" && role !== "admin")) && !user) {
         navigate('/');
         return;
      };
   }, [navigate, role, user]);

   return (
      <div>
         this is owner data
      </div>
   );
};

export default OwnerData;