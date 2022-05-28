import { useEffect, useState } from "react"

export const useFetch = (url) => {
   const [data, setData] = useState(null || {} || [] || "");
   const [loading, setLoading] = useState(false);
   const [err, setErr] = useState(null);
   const [ref, setRef] = useState(false);

   let refetch;
   refetch = () => {
      return setRef(e => !e);
   }

   useEffect(() => {
      setLoading(true);
      const controller = new AbortController();
      (async () => {
         try {
            const response = await fetch(url, {signal : controller?.signal});

            if (response.status >= 200 && response.status <= 299) {
               const data = await response.json();
               setData(data);
               setLoading(false);
            } else {
               throw new Error("Something went wrong");
            }

         } catch (error) {
            setErr(error);
         }
      })();

      return () => {
         controller.abort();
      }
   }, [url, ref]);

   return { data, loading, err, refetch };
}