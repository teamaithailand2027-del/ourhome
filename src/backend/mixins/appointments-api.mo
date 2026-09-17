import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import AppointmentTypes "../types/appointments";
import NotificationTypes "../types/notifications";
import AppointmentLib "../lib/appointments";
import NotificationLib "../lib/notifications";

mixin (
  appointments : Map.Map<Nat, AppointmentTypes.Appointment>,
  state : { var nextAppointmentId : Nat },
  notifications : Map.Map<Nat, NotificationTypes.Notification>,
  notificationState : { var nextNotificationId : Nat },
) {
  public query ({ caller }) func listAppointments() : async [AppointmentTypes.Appointment] {
    AppointmentLib.listAppointments(appointments, caller);
  };

  public query ({ caller }) func getAppointment(id : Nat) : async ?AppointmentTypes.Appointment {
    AppointmentLib.getAppointment(appointments, id, caller);
  };

  public shared ({ caller }) func bookAppointment(appointment : AppointmentTypes.Appointment) : async Nat {
    let id = AppointmentLib.bookAppointment(appointments, state, appointment);
    let notification : NotificationTypes.Notification = {
      id = 0;
      userId = caller;
      message = "การนัดหมายของคุณถูกบันทึกแล้ว กำลังรอการยืนยัน";
      createdAt = Time.now();
      read = false;
    };
    ignore NotificationLib.addNotification(notifications, notificationState, notification);
    id;
  };

  public shared ({ caller }) func confirmAppointment(id : Nat) : async () {
    AppointmentLib.confirmAppointment(appointments, id);
  };

  public shared ({ caller }) func cancelAppointment(id : Nat) : async () {
    AppointmentLib.cancelAppointment(appointments, id);
  };
};
