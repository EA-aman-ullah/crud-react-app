import axios, { CanceledError, GenericAbortSignal } from "axios";
import { useEffect, useState } from "react";
import UpdateUser from "./UpdateUser";
import { toast, ToastContainer } from "react-toastify";

export interface User {
  _id: string;
  name: string;
  email: string;
  gender: string;
  phoneNo: string;
  title: string;
}

export type UserWithoutId = Omit<User, "_id">;

const UserTable = () => {
  const [users, setUsers] = useState<User[]>();
  const [error, setError] = useState();
  const [isValid, setValid] = useState(true);
  const [person, setPerson] = useState({
    name: "",
    email: "",
    phoneNo: "",
    title: "",
    gender: "",
  });

  const success = () => {
    toast.success("Successfully Updated", {
      autoClose: 3000,
      position: "top-right",
    });
  };

  const handleChange = (event: any) => {
    let name = event.target.name;
    setPerson({ ...person, [name]: event.target.value });
  };

  const getAll = (signal: GenericAbortSignal) => {
    axios
      .get<User[]>("http://localhost:3000/user", { signal: signal })
      .then((result) => setUsers(result.data))
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setError(err.message);
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    getAll(controller.signal);
    return () => controller.abort();
  }, []);

  const deleteUser = (id: string) => {
    const controller = new AbortController();
    const orignalUser = users ? [...users] : [];

    setUsers(users?.filter((u) => u._id !== id));
    axios
      .delete(`http://localhost:3000/user/${id}`)
      .then(() => getAll(controller.signal))
      .catch((err) => {
        setError(err.message);
        setUsers(orignalUser);
      });
  };

  const updateUser = (id: string, user: UserWithoutId) => {
    const { signal } = new AbortController();

    axios
      .put(`http://localhost:3000/user/${id}`, user)
      .then(() => {
        getAll(signal);
        success();
      })
      .catch((err) => console.log(err.message));
  };

  const addUser = () => {
    const { signal } = new AbortController();
    if (
      /^[a-zA-Z ]{3,}$/.test(person.name) &&
      /^[a-zA-Z ]{3,}$/.test(person.title) &&
      /^[a-zA-Z ]{3,}$/.test(person.gender) &&
      person.phoneNo.length > 9 &&
      /^([^@\s]+)[@]((?:[-a-z0-9]+\.)+[a-z]{3,})$/i.test(person.email)
    ) {
      axios
        .post("http://localhost:3000/user", person)
        .then(() => {
          getAll(signal);
          setPerson({
            name: "",
            email: "",
            phoneNo: "",
            gender: "",
            title: "",
          });
          setValid(true);
        })
        .catch((err) => setError(err.message));
    } else {
      setValid(false);
    }
  };

  if (error) return <div>{error}</div>;

  return (
    <>
      <table className="table border">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone No</th>
            <th>Title</th>
            <th>Gender</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input
                onChange={(e) => handleChange(e)}
                value={person.name}
                name="name"
                className={
                  !/^[a-zA-Z ]{3,}$/.test(person.name) && !isValid
                    ? "form-control is-invalid"
                    : "form-control"
                }
                type="text"
              />
            </td>
            <td>
              <input
                onChange={(e) => handleChange(e)}
                value={person.email}
                name="email"
                className={
                  !/^([^@\s]+)[@]((?:[-a-z0-9]+\.)+[a-z]{3,})$/i.test(
                    person.email
                  ) && !isValid
                    ? "form-control is-invalid"
                    : "form-control"
                }
                type="text"
              />
            </td>
            <td>
              <input
                onChange={(e) => handleChange(e)}
                value={person.phoneNo}
                name="phoneNo"
                type="number"
                className={
                  !(person.phoneNo.length > 9) && !isValid
                    ? "form-control is-invalid"
                    : "form-control"
                }
              />
            </td>
            <td>
              <input
                onChange={(e) => handleChange(e)}
                value={person.title}
                name="title"
                className={
                  !/^[a-zA-Z ]{3,}$/.test(person.title) && !isValid
                    ? "form-control is-invalid"
                    : "form-control"
                }
                type="text"
              />
            </td>
            <td>
              <input
                onChange={(e) => handleChange(e)}
                value={person.gender}
                name="gender"
                className={
                  !/^[a-zA-Z ]{3,}$/.test(person.gender) && !isValid
                    ? "form-control is-invalid"
                    : "form-control"
                }
                type="text"
              />
            </td>
            <td>
              <button onClick={addUser} className="btn btn-secondary w-100">
                Add User
              </button>
            </td>
          </tr>
          {users?.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phoneNo}</td>
              <td>{user.title}</td>
              <td>{user.gender}</td>
              <td>
                <div className="d-flex gap-2  ">
                  <div className="w-50">
                    <UpdateUser user={user} updateUser={updateUser} />
                  </div>
                  <button
                    className="btn btn-danger w-50"
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer autoClose={3000} />
    </>
  );
};

export default UserTable;
