import React from "react"
import { Button } from "@mui/material"

interface ExampleComponentProps {
  text: string
  onClick: () => void
}

export const ExampleComponent: React.FC<ExampleComponentProps> = ({
  text,
  onClick
}) => {
  return <div className="p-4 bg-blue-500 rounded"></div>
}
