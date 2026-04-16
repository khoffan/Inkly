import React from "react";
import FieldDataProfile from "./FieldDataProfile";
import { Helmet } from "react-helmet-async";

export default function UpdateProfileDetail({ id, oldData }) {
  return (
    <div className="w-full font-sans">
      <Helmet>
        <title>Inkly - Edit Profile</title>
        <meta name="description" content="Inkly Edit Profile" />
        <meta name="keywords" content="edit profile, profile, edit profile" />
      </Helmet>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8 font-serif">
        Edit Profile
      </h1>

      <div className="bg-white border text-left border-gray-100 rounded-2xl shadow-sm p-8">
        <FieldDataProfile id={id} oldData={oldData} isUpdate={true} />
      </div>
    </div>
  );
}
