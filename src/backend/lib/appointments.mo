import AppointmentTypes "../types/appointments";
import Principal "mo:core/Principal";
import Map "mo:core/Map";

module {
  public func listAppointments(appointments : Map.Map<Nat, AppointmentTypes.Appointment>, userId : Principal) : [AppointmentTypes.Appointment] {
    let all = appointments.entries().toArray();
    all.filter(func (_, a) = a.userId == userId).map(func (_, a) = a);
  };

  public func getAppointment(appointments : Map.Map<Nat, AppointmentTypes.Appointment>, id : Nat, userId : Principal) : ?AppointmentTypes.Appointment {
    switch (appointments.get(id)) {
      case (?a) { if (a.userId == userId) { ?a } else { null } };
      case null { null };
    };
  };

  public func bookAppointment(appointments : Map.Map<Nat, AppointmentTypes.Appointment>, state : { var nextAppointmentId : Nat }, appointment : AppointmentTypes.Appointment) : Nat {
    let id = state.nextAppointmentId;
    state.nextAppointmentId += 1;
    appointments.add(id, { appointment with id; status = #pending });
    id;
  };

  public func confirmAppointment(appointments : Map.Map<Nat, AppointmentTypes.Appointment>, id : Nat) : () {
    switch (appointments.get(id)) {
      case (?a) { appointments.add(id, { a with status = #confirmed }) };
      case null {};
    };
  };

  public func cancelAppointment(appointments : Map.Map<Nat, AppointmentTypes.Appointment>, id : Nat) : () {
    switch (appointments.get(id)) {
      case (?a) { appointments.add(id, { a with status = #cancelled }) };
      case null {};
    };
  };
};
