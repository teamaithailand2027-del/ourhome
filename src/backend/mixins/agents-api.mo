import Map "mo:core/Map";
import AgentTypes "../types/agents";
import AgentsLib "../lib/agents";

mixin (
  agents : Map.Map<Nat, AgentTypes.Agent>,
  state : { var nextAgentId : Nat },
) {
  public query func listAgents() : async [AgentTypes.Agent] {
    AgentsLib.listAgents(agents);
  };

  public query func getAgent(id : Nat) : async ?AgentTypes.Agent {
    AgentsLib.getAgent(agents, id);
  };

  public shared ({ caller }) func addAgent(agent : AgentTypes.Agent) : async Nat {
    ignore caller;
    AgentsLib.addAgent(agents, state, agent);
  };

  public shared ({ caller }) func updateAgent(agent : AgentTypes.Agent) : async () {
    ignore caller;
    AgentsLib.updateAgent(agents, agent);
  };

  public shared ({ caller }) func deleteAgent(id : Nat) : async () {
    ignore caller;
    AgentsLib.deleteAgent(agents, id);
  };
};
