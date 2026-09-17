import NotificationTypes "../types/notifications";
import Principal "mo:core/Principal";
import Map "mo:core/Map";

module {
  public func listNotifications(notifications : Map.Map<Nat, NotificationTypes.Notification>, userId : Principal) : [NotificationTypes.Notification] {
    let all = notifications.entries().toArray();
    all.filter(func (_, n) = n.userId == userId).map(func (_, n) = n);
  };

  public func addNotification(notifications : Map.Map<Nat, NotificationTypes.Notification>, state : { var nextNotificationId : Nat }, notification : NotificationTypes.Notification) : Nat {
    let id = state.nextNotificationId;
    state.nextNotificationId += 1;
    notifications.add(id, { notification with id });
    id;
  };

  public func markRead(notifications : Map.Map<Nat, NotificationTypes.Notification>, id : Nat) : () {
    switch (notifications.get(id)) {
      case (?n) { notifications.add(id, { n with read = true }) };
      case null {};
    };
  };
};
