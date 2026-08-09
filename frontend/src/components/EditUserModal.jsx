import { useState } from "react";
import InputField from "../components/InputField";
import FormButton from "../components/FormButton";

function EditUserModal({
    user,
    onClose,
    onSave,
    onDelete,
}) {
    const [formData, setFormData] = useState({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "user",
    });

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        onSave(user._id, formData);
    }

    return (
        <div className="form_container modal-overlay pd_fixed">

            <div className="form_wrap modal radius">

                <div className="modal-header flex gap_sm align_center space_between">
                    <h3 className="color_green font_large">Edit User</h3>

                    <button
                        type="button"
                        className="modal_close"
                        onClick={onClose}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--text-dark)"><path d="M256-213.85 213.85-256l224-224-224-224L256-746.15l224 224 224-224L746.15-704l-224 224 224 224L704-213.85l-224-224-224 224Z"></path></svg>
                    </button>
                </div>

                <p className="mt_xsm para_xsm color_light font_xsmall">
                    Update the user's account details and permissions.
                </p>

                <form onSubmit={handleSubmit}>

                    <InputField
                        label="Full Name"
                        type="text"
                        name="name"
                        placeholder="Enter user name"
                        value={formData.name}
                        onChange={handleChange}
                    />

                    <InputField
                        label="Email Address"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <div className="input_group">
                        <label htmlFor="role">
                            Role
                        </label>

                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="user">
                                User
                            </option>

                            <option value="admin">
                                Admin
                            </option>
                        </select>
                    </div>

                    <div className="flex gap_sm justify_center modal_footer">

                           <button
                            type="button"
                            className="btn_danger"
                            onClick={() => onDelete(user._id)}
                        >
                            Delete User
                        </button>
                        <FormButton
                            text="Save Changes"
                        />

      
                    </div>

                </form>

            </div>

        </div>
    );
}

export default EditUserModal;
