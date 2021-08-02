import React from 'react';
import AuthenticatedNavbar from '../navbars/authenticatedNavbar/AuthenticatedNavbar';
import Navbar from '../navbars/nonAuthenticatedNavbar/Navbar';
import RegistrationForm from './RegistrationForm';

// eslint-disable-next-line react/prop-types
export default function Registration({ user, logoutUser }) {
  return (
    <>
      {!user && <Navbar />}
      {user && <AuthenticatedNavbar user={user} logoutUser={logoutUser} />}
      <h1 className="text-center">Registration</h1>
      <RegistrationForm />
    </>
  );
}
