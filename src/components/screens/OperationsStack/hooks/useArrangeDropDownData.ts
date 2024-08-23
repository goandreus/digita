import { useMemo } from "react"
import { Currency } from "@features/userInfo"

export const useArrangeDropDownData = (data:any,currency:Currency) => useMemo(() => data.map((e: any) => {
    return {
      ...e,
      title: e.productName,
      subtitle: e.accountCode,
      value: `${e.currency} ${e.sBalance}`
    }
  }),[currency,data])