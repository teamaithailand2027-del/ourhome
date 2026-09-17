import Principal "mo:core/Principal";

module {
  public type UserId = Principal;
  public type Timestamp = Int;

  public type Location = {
    province : Text;
    district : Text;
    subDistrict : Text;
  };

  public type Coordinates = {
    lat : Float;
    lng : Float;
  };

  public type RatingCategory = {
    trust : Nat;
    info : Nat;
    service : Nat;
    followUp : Nat;
    politeness : Nat;
    speed : Nat;
  };

  public type VerificationStatus = {
    #none;
    #verified;
    #official;
  };

  public type ProjectStatus = {
    #new;
    #ongoing;
    #completed;
  };

  public type UnitStatus = {
    #available;
    #reserved;
    #sold;
  };

  public type HouseStatus = {
    #readyToMove;
    #underConstruction;
  };

  public type LeadStatus = {
    #new;
    #contacted;
    #siteVisit;
    #interested;
    #reserved;
    #closed;
  };

  public type AppointmentStatus = {
    #pending;
    #confirmed;
    #cancelled;
    #completed;
  };
};
