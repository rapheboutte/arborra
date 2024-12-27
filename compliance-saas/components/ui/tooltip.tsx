"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider
const TooltipTrigger = TooltipPrimitive.Trigger
const TooltipContent = TooltipPrimitive.Content

const Tooltip = TooltipPrimitive.Root

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
}
