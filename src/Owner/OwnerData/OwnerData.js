import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth';
import { useAuthUser } from '../../lib/UserProvider';

const OwnerData = () => {
   const user = useAuthUser();
   const { role } = useAuth();
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