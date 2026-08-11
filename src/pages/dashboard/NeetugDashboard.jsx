import React from "react";
import NeetugDashboardHero from "../../components/dashboard/neetug/NeetugDashboardHero";
import NeetugUpdates from "../../components/dashboard/neetug/NeetugUpdates";
import NeetugDashboardInfo from "../../components/dashboard/neetug/NeetugDashboardInfo";

function NeetugDashboard() {
  return (
    <div>
      <NeetugDashboardHero />
      <NeetugUpdates />
      <NeetugDashboardInfo />
    </div>
  );
}

export default NeetugDashboard;
