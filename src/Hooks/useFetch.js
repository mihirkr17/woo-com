import { useEffect, useState } from "react"

export const useFetch = (url) => {
   const [data, setData] = useState();
   const [loading, setLoading] = useState(false);
   const [err, setErr] = useState(null);
   const [ref, setRef] = useState(false);

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

               if (response.status >= 200 && response.status <= 299) {
                  setData(await response.json());
               }
            } catch (error) {
               setErr(error);
            } finally {
               setLoading(false);
            }
         })();
      }, 100);


      return () => clearTimeout(fetchData);

   }, [url, ref]);

   return { data, loading, err, refetch };
}