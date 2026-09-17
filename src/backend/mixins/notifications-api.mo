import Map "mo:core/Map";
import Principal "mo:core/Principal";
import NotificationTypes "../types/notifications";
import NotificationLib "../lib/notifications";

mixin (
  notifications : Map.Map<Nat, NotificationTypes.Notification>,
  state : { var nextNotificationId : Nat },
) {
  public query ({ caller }) func listNotifications() : async [NotificationTypes.Notification] {
    NotificationLib.listNotifications(notifications, caller);
  };

  public shared ({ caller }) func markNotificationRead(id : Nat) : async () {
    NotificationLib.markRead(notifications, id);
  };
};
