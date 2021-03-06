/* eslint-disable react/prop-types */
import AuthenticatedNavbar from "../../../../Common/navbars/authenticatedNavbar/AuthenticatedNavbar";
import NewEventForm from "./NewEventForm";

export default function NewEvent({ user, setUser }) {
  return (
    <div className="new-event">
      <AuthenticatedNavbar user={user} setUser={setUser} />
      <h3 className="text-center m-3">Új esemény rögzítése</h3>
      <NewEventForm user={user} />
    </div>
  )
}