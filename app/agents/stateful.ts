import { Agent } from "agents-sdk";

export class Stateful extends Agent<Env> {
  initialState = {
    counter: 0,
    text: "",
    color: "#3B82F6",
    hello: this.env.VALUE_FROM_CLOUDFLARE
  };
}
