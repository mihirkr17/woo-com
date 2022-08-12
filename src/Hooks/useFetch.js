import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export const useFetch = (url) => {
   const [data, setData] = useState();
   const [loading, setLoading] = useState(false);
   const [err, setErr] = useState(null);
   const [ref, setRef] = useState(false);
   const navigate = useNavigate();

   let refetch;
   refetch = () => setRef(e => !e);

   useEffect(() => {

      const fetchData = setTimeout(() => {
         (async () => {
            try {
               setLoading(true);
               const response = await fetch(url);

               if (response.status === 400) {
                  window.location.reload();
               }

               const resData = await response.json();

               if (response.status >= 200 && response.status <= 299) {
                  setData(resData);
               } else {
                  navigate('/');
               }
            } catch (error) {
               setErr(error);
            } finally {
               setLoading(false);
            }
         })();
      }, 100);


      return () => clearTimeout(fetchData);

   }, [url, ref, navigate]);

   return { data, loading, err, refetch };
}