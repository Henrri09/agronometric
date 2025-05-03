import { useContext } from "react";
import { CompanyIdContext } from "../components/dashboard/CompanyIdProvider";

export function useCompanyId() {
  const context = useContext(CompanyIdContext);

  if (!context) {
    throw new Error("useCompanyId must be used within a <CompanyIdProvider />");
  }

  return context;
}