import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { authLogout } from "../Shared/common";

export const useFetch = (url, authorization = "") => {
   const [data, setData] = useState();
   const [loading, setLoading] = useState(true);
   const [err, setErr] = useState(null);
   const [ref, setRef] = useState(false);
   const navigate = useNavigate();

   const refetch = () => setRef(e => !e);

   useEffect(() => {
      const fetchData = setTimeout(() => {
         (async () => {
            try {
               if (url) {


                  setLoading(true);

                  const response = await fetch(url, {
                     withCredential: true,
                     credentials: 'include',
                     headers: {
                        authorization
                     }
                  });

                  const resData = await response.json();


                  if (response.ok) {
                     setLoading(false);
                     setData(resData);
                  } else {
                     setLoading(false);

                     if (response.status === 401) {
                        await authLogout();
                        return;
                     }

                     navigate('/');
                  }
               }
            } catch (error) {
               setErr(error);
            } finally {
               setLoading(false);
            }
         })();
      }, 0);


      return () => clearTimeout(fetchData);

   }, [url, authorization, ref, navigate]);

   return { data, loading, err, refetch };
}