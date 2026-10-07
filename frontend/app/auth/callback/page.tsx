import { Suspense } from "react";
import AuthCallbackContent from "./AuthCallbackContent";

export default function AuthCallbackPage()
{
  return ( 
  <Suspense
      fallback={<div>Signing you in...</div>}>
    <AuthCallbackContent />
  </Suspense> ); 
}