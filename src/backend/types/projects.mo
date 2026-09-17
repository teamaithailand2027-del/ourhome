import Types "../types/common";

module {
  public type Project = {
    id : Nat;
    name : Text;
    location : Types.Location;
    startingPrice : Nat;
    houseTypes : [Text];
    promotions : [Text];
    images : [Text];
    video : ?Text;
    coordinates : Types.Coordinates;
    unitCount : Nat;
    unitStatus : Types.UnitStatus;
    projectStatus : Types.ProjectStatus;
    reviewRating : Float;
    verificationStatus : Types.VerificationStatus;
    createdAt : Types.Timestamp;
  };

  public type ProjectFilter = {
    name : ?Text;
    province : ?Text;
    district : ?Text;
    location : ?Text;
    minPrice : ?Nat;
    maxPrice : ?Nat;
    houseType : ?Text;
    bedrooms : ?Nat;
    usableArea : ?Nat;
    readyToMove : ?Bool;
    newProject : ?Bool;
    promotion : ?Bool;
  };
};
