import { useEffect, useState } from "react"

// message hooks
export const useMessage = () => {
   const [msg, setMsg] = useState('');
   let setMessage;

   setMessage = (message, types = "success") => {

      setMsg(
         <p>
            <small className={`${types === "warning" ? "text-warning" : types === "danger" ? "text-danger" : "text-success"}`}>
               <strong>
                  {message}
               </strong>
            </small>
         </p>
      );
   }

   useEffect(() => {
      const messageTimeout = setTimeout(() => {
         setMsg("");
      }, 4000);
      return () => clearInterval(messageTimeout);
   }, [msg]);

   return { msg, setMessage };
}
