import Map "mo:core/Map";
import HouseTypes "../types/houses";

module {
  public func listHouses(
    houses : Map.Map<Nat, HouseTypes.House>,
    projectId : ?Nat,
  ) : [HouseTypes.House] {
    houses.values().toArray().filter(func h =
      switch (projectId) {
        case (?pid) { h.projectId == pid };
        case null { true };
      }
    );
  };

  public func getHouse(houses : Map.Map<Nat, HouseTypes.House>, id : Nat) : ?HouseTypes.House {
    houses.get(id);
  };

  public func addHouse(
    houses : Map.Map<Nat, HouseTypes.House>,
    state : { var nextHouseId : Nat },
    house : HouseTypes.House,
  ) : Nat {
    let id = state.nextHouseId;
    state.nextHouseId += 1;
    houses.add(id, { house with id = id });
    id;
  };

  public func updateHouse(houses : Map.Map<Nat, HouseTypes.House>, house : HouseTypes.House) : () {
    houses.add(house.id, house);
  };

  public func deleteHouse(houses : Map.Map<Nat, HouseTypes.House>, id : Nat) : () {
    houses.remove(id);
  };
};
