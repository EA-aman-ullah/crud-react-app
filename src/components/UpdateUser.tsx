import { User, UserWithoutId } from "./UserTable";
import Form from "./Form";

interface Props {
  user: User;
  updateUser: (id: string, user: UserWithoutId) => void;
}

const UpdateUser = ({ user, updateUser }: Props) => {
  const modalId = `modal-${user._id}`; // Generate a unique id for each modal

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target={`#${modalId}`} // Use the unique id
      >
        Update
      </button>

      <div
        className="modal fade"
        id={modalId} // Unique id for the modal
        aria-labelledby={`${modalId}-label`} // Unique label id
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id={`${modalId}-label`}>
                Edit User
              </h1>
            </div>
            <div className="modal-body">
              <Form user={user} updateUser={updateUser} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateUser;
