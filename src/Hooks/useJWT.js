import { useContext } from "react";
import { JWTContext } from "../lib/JWTProvider";

export const useJWT = () => useContext(JWTContext);