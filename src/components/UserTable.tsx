import { useState } from "react";
import { ToastContainer } from "react-toastify";
import useUsers from "../hooks/useUsers";
import userService, { User } from "../services/user-service";
import UpdateUser from "./UpdateUser";

export type UserWithoutId = Omit<User, "_id">;

const UserTable = () => {
  const { users, error, reFetch, setUsers, setError, success } = useUsers();
  const [isValid, setValid] = useState(true);
  const [person, setPerson] = useState({
    name: "",
    email: "",
    phoneNo: "",
    title: "",
    gender: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let name = event.target.name;
    setPerson({ ...person, [name]: event.target.value });
  };

  const deleteUser = (id: string) => {
    const orignalUser = users ? [...users] : [];

    setUsers(users?.filter((u) => u._id !== id));
    userService
      .delete(id)
      .then(() => {
        success();
        reFetch();
      })
      .catch((err) => {
        setUsers(orignalUser);
        setError(err.message);
      });
  };

  const updateUser = (id: string, user: UserWithoutId) => {
    userService
      .update<UserWithoutId>(id, user)
      .then(() => {
        success();
        reFetch();
      })
      .catch((err) => setError(err.message));
  };

  const addUser = () => {
    if (
      /^[a-zA-Z ]{3,}$/.test(person.name) &&
      /^[a-zA-Z ]{3,}$/.test(person.title) &&
      /^[a-zA-Z ]{3,}$/.test(person.gender) &&
      person.phoneNo.length > 9 &&
      /^([^@\s]+)[@]((?:[-a-z0-9]+\.)+[a-z]{3,})$/i.test(person.email)
    ) {
      userService
        .add<UserWithoutId>(person)
        .then(() => {
          reFetch();
          setPerson({
            name: "",
            email: "",
            phoneNo: "",
            gender: "",
            title: "",
          });
          setValid(true);
          success();
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
