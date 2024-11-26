import { useEffect, useState } from "react";
import userService, { User } from "../services/user-service";
import { CanceledError } from "../services/api-client";

const useUsers = () => {
  const [users, setUsers] = useState<User[]>();
  const [error, setError] = useState();
  const [fetch, setFetch] = useState(false);

  const reFetch = () => {
    setFetch(!fetch);
  };

  useEffect(() => {
    const { request, cancel } = userService.getAll<User>();
    // setRequest(request as any);
    request
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
      });

    return () => cancel();
  }, [fetch]);
  return {
    users,
    error,
    reFetch,
    setUsers,
    setError,
  };
};

export default useUsers;
