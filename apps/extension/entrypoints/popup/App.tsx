import { csActions, useCount, useSecret } from "../../src/bg/state"
import { Button } from "@repo/ui/components/ui/button"
import React from "react"

const App: React.FC = () => {
  const count = useCount()
  const secret = useSecret()

  return (
    <div className="p-10 bg-red-300">
      <h1 className="text-2xl font-bold mb-4">
        Template Extension (Instal Page)
      </h1>
      <p className="mb-2">Count: {count}</p>
      <Button
        onClick={() => {
          csActions.increment()
        }}>
        Increment
      </Button>
      <h1>Secret Color: {secret}</h1>
      <div style={{ backgroundColor: secret }} className="w-10 h-10"></div>
    </div>
  )
}

export default App
