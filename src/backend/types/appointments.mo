import Types "../types/common";

module {
  public type Appointment = {
    id : Nat;
    userId : Types.UserId;
    projectId : Nat;
    houseId : ?Nat;
    houseType : ?Text;
    date : Types.Timestamp;
    time : Types.Timestamp;
    visitors : Nat;
    agentId : ?Nat;
    name : Text;
    phone : Text;
    status : Types.AppointmentStatus;
  };
};
