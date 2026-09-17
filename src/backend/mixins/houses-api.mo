import Map "mo:core/Map";
import HouseTypes "../types/houses";
import HousesLib "../lib/houses";

mixin (
  houses : Map.Map<Nat, HouseTypes.House>,
  state : { var nextHouseId : Nat },
) {
  public query func listHouses(projectId : ?Nat) : async [HouseTypes.House] {
    HousesLib.listHouses(houses, projectId);
  };

  public query func getHouse(id : Nat) : async ?HouseTypes.House {
    HousesLib.getHouse(houses, id);
  };

  public shared ({ caller }) func addHouse(house : HouseTypes.House) : async Nat {
    ignore caller;
    HousesLib.addHouse(houses, state, house);
  };

  public shared ({ caller }) func updateHouse(house : HouseTypes.House) : async () {
    ignore caller;
    HousesLib.updateHouse(houses, house);
  };

  public shared ({ caller }) func deleteHouse(id : Nat) : async () {
    ignore caller;
    HousesLib.deleteHouse(houses, id);
  };
};
