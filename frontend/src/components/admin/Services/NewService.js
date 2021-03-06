/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom"
import AuthenticatedNavbar from "../../../Common/navbars/authenticatedNavbar/AuthenticatedNavbar"
import { backend } from "../../../utilities";
import NewServiceForm from "./NewServiceForm";
import '../../../scss/newService.scss';


export default function NewService({ user, setUser }) {
  const { id } = useParams();

  const [serviceData, setServiceData] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`${backend.endpoint}/admin/services/${id}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: null,
      })
        .then(res => res.json())
        .then(res => {
          if (res.status < 200 || res.status >= 300) throw new Error(res?.error);
          setServiceData(res.serviceData);
        }).catch(err => setFetchError(err.message));
    }

  }, [])


  return (
    <div className="new-service">
      <AuthenticatedNavbar user={user} setUser={setUser} />
      {!id && <h3 className="text-center m-3">Új szakterület</h3>}
      {id && <h3 className="text-center m-3">Szakterület módosítása</h3>}
      {fetchError && (
        <div className="alert alert-danger" role="alert">
          {fetchError}
        </div>
      )}
      {!serviceData && <NewServiceForm
        token={user.token} />}
      {serviceData && <NewServiceForm
        token={user.token}
        id={id}
        serviceData={serviceData} />}
      <Link
        className="btn return-btn m-3"
        to="/admin/services">Vissza</Link>
    </div>
  )
}