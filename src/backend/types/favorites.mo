import Types "../types/common";

module {
  public type Favorite = {
    userId : Types.UserId;
    projects : [Nat];
    houses : [Nat];
    houseTypes : [Text];
    agents : [Nat];
    savedPosts : [Nat];
  };
};
