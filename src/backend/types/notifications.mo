import Types "../types/common";

module {
  public type Notification = {
    id : Nat;
    userId : Types.UserId;
    message : Text;
    createdAt : Types.Timestamp;
    read : Bool;
  };
};
