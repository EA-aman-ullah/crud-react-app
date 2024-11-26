import { FormEvent, useState } from "react";
import {  UserWithoutId } from "./UserTable";
import { User } from "../services/user-service";

interface Props {
  user: User;
  updateUser: (id: string, user: UserWithoutId) => void;
}

const Form = ({ user, updateUser }: Props) => {
  const [person, setPerson] = useState({
    name: user.name,
    email: user.email,
    phoneNo: user.phoneNo,
    title: user.title,
    gender: user.gender,
  });

  const [isValid, setValid] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let name = event.target.name;
    setPerson({ ...person, [name]: event.target.value });
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();

    if (
      /^[a-zA-Z ]{3,}$/.test(person.name) &&
      /^[a-zA-Z ]{3,}$/.test(person.title) &&
      /^[a-zA-Z ]{3,}$/.test(person.gender) &&
      person.phoneNo.length > 9 &&
      /^([^@\s]+)[@]((?:[-a-z0-9]+\.)+[a-z]{3,})$/i.test(person.email)
    ) {
      updateUser(user._id, person);
      setValid(false);
    } else {
      setValid(true);
    }
  };

  return (
    <>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="text-info">Name</label>
          <input
            value={person.name}
            name="name"
            type="text"
            onChange={handleChange}
            className="form-control"
          />
          {person.name.length === 0 && isValid && (
            <p className="text-danger">Please Enter Your Name</p>
          )}
          {!(person.name.length === 0) &&
            !/^[a-zA-Z]{4,}$/.test(person.name) &&
            isValid && (
              <p className="text-danger">
                Name must be at least 4 alphabets charecters
              </p>
            )}
        </div>
        <div className="mb-3">
          <label className="text-info">Phone Number</label>
          <input
            value={person.phoneNo}
            name="phoneNo"
            type="number"
            onChange={handleChange}
            className="form-control"
          />
          {person.phoneNo.length === 0 && isValid && (
            <p className="text-danger">Please Enter Phone Number</p>
          )}
          {!(person.phoneNo.length === 0) &&
            person.phoneNo.length < 10 &&
            isValid && (
              <p className="text-danger">
                The Number must be at least 10 charecters{" "}
              </p>
            )}
        </div>
        <div className="mb-3">
          <label className="text-info">Email</label>
          <input
            value={person.email}
            name="email"
            type="text"
            onChange={handleChange}
            className="form-control"
          />
          {!person.email && isValid && (
            <p className="text-danger">Enter Your Email</p>
          )}
          {!/^([^@\s]+)[@]((?:[-a-z0-9]+\.)+[a-z]{3,})$/i.test(person.email) &&
            person.email &&
            isValid && (
              <p className="text-danger">
                Formt must be like "email@example.com"
              </p>
            )}
        </div>
        <div className="mb-3">
          <label className="text-info">Title</label>
          <input
            value={person.title}
            name="title"
            type="text"
            onChange={handleChange}
            className="form-control"
          />
          {person.title.length === 0 && isValid && (
            <p className="text-danger">Please Enter Title</p>
          )}
          {!(person.title.length === 0) &&
            !/^[a-zA-Z]{4,}$/.test(person.name) &&
            isValid && (
              <p className="text-danger">Title must be at least 4 charecters</p>
            )}
        </div>
        <div className="mb-3">
          <label className="text-info">Gender</label>
          <input
            value={person.gender}
            name="gender"
            type="text"
            onChange={handleChange}
            className="form-control"
          />
          {person.gender.length === 0 && isValid && (
            <p className="text-danger">Please Enter a gender</p>
          )}
          {!(person.gender.length === 0) &&
            !/^[a-zA-Z]{4,}$/.test(person.name) &&
            isValid && (
              <p className="text-danger">
                Gender must be at least 4 alphabets charecters
              </p>
            )}
        </div>

        <div className="mb-3">
          <button
            type="submit"
            className="btn btn-primary"
            data-bs-dismiss={
              /^[a-zA-Z]{4,}$/.test(person.name) &&
              /^[a-zA-Z ]{3,}$/.test(person.title) &&
              /^[a-zA-Z ]{3,}$/.test(person.gender) &&
              person.phoneNo.length > 9 &&
              /^([^@\s]+)[@]((?:[-a-z0-9]+\.)+[a-z]{3,})$/i.test(person.email)
                ? "modal"
                : ""
            }
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default Form;
