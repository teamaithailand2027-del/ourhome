import Map "mo:core/Map";
import AgentTypes "../types/agents";

module {
  public func listAgents(agents : Map.Map<Nat, AgentTypes.Agent>) : [AgentTypes.Agent] {
    agents.values().toArray();
  };

  public func getAgent(agents : Map.Map<Nat, AgentTypes.Agent>, id : Nat) : ?AgentTypes.Agent {
    agents.get(id);
  };

  public func addAgent(
    agents : Map.Map<Nat, AgentTypes.Agent>,
    state : { var nextAgentId : Nat },
    agent : AgentTypes.Agent,
  ) : Nat {
    let id = state.nextAgentId;
    state.nextAgentId += 1;
    agents.add(id, { agent with id = id });
    id;
  };

  public func updateAgent(agents : Map.Map<Nat, AgentTypes.Agent>, agent : AgentTypes.Agent) : () {
    agents.add(agent.id, agent);
  };

  public func deleteAgent(agents : Map.Map<Nat, AgentTypes.Agent>, id : Nat) : () {
    agents.remove(id);
  };
};
