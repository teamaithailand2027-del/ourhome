import Types "../types/common";

module {
  public type House = {
    id : Nat;
    projectId : Nat;
    houseType : Text;
    usableArea : Nat;
    bedrooms : Nat;
    bathrooms : Nat;
    parking : Nat;
    price : Nat;
    floorPlan : ?Text;
    gallery : [Text];
    video : ?Text;
    status : Types.HouseStatus;
  };
};
