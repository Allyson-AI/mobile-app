import React, { useState, useEffect } from "react";
import SessionComponent from "~/components/browser/session";
import EnableNotificationsDialog from "~/components/dialogs/enable-notifications";
import { useUser } from "~/context/UserContext";

export default function Home() {
  const { user, loading } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    if (!loading && !user?.notificationSettings.mobile) {
      setIsModalOpen(true);
    }
  }, [loading, user]);

  return (
    <>
      <SessionComponent />
      <EnableNotificationsDialog
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
}
