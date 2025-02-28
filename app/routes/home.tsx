import { useState } from "react";
import { useAgent } from "agents-sdk/react";
import { Welcome } from "../welcome/welcome";
import type { Route } from "./+types/home";

interface SyncedState {
  counter: number;
  text: string;
  color: string;
  initialState?: boolean;
}

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Stateful Agent Test" },
    { name: "description", content: "Testing Durable Object connection" },
  ];
}

export default function Home({ actionData, loaderData }: Route.ComponentProps) {
  const [syncedState, setSyncedState] = useState<SyncedState>({
    counter: 0,
    text: "",
    color: "#3B82F6",
    initialState: true,
  });

  const agent = useAgent<SyncedState>({
    agent: "Stateful",
    onStateUpdate: (state) => {
      setSyncedState(state);
    },
  });

  const handleIncrement = () => {
    agent.setState({ ...syncedState, counter: syncedState.counter + 1 });
  };

  const handleDecrement = () => {
    agent.setState({ ...syncedState, counter: syncedState.counter - 1 });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    agent.setState({ ...syncedState, text: e.target.value });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    agent.setState({ ...syncedState, color: e.target.value });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 py-10">
      <div className="rounded-lg border bg-gray-50 p-6 dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-bold">Stateful Agent Demo</h2>

        {!syncedState.initialState && (
          <>
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={handleDecrement}
                className="rounded bg-red-500 px-4 py-2 text-white"
              >
                -
              </button>
              <span className="text-xl font-bold">{syncedState.counter}</span>
              <button
                onClick={handleIncrement}
                className="rounded bg-green-500 px-4 py-2 text-white"
              >
                +
              </button>
            </div>

            <input
              type="text"
              value={syncedState.text}
              onChange={handleTextChange}
              placeholder="Type to sync text..."
              className="w-full rounded border px-3 py-2 dark:bg-gray-700 dark:text-gray-200"
            />

            <div className="mt-4 flex items-center gap-2">
              <span>Color:</span>
              <input
                type="color"
                value={syncedState.color}
                onChange={handleColorChange}
                className="h-8 w-8"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
