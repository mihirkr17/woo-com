import { useEffect, useState } from "react"

// message hooks
export const useMessage = () => {
   const [msg, setMsg] = useState('');
   let setMessage;

   setMessage = (message) => {
      setMsg(message);
   }

   useEffect(() => {
      const messageTimeout = setTimeout(() => {
         setMsg("");
      }, 4000);
      return () => clearInterval(messageTimeout);
   }, [msg]);

   return { msg, setMessage };
}
