function ViewUserModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="modal-overlay">
      <div className="modal radius">

        <div className="modal-header flex gap_sm align_center space_between">
          <h3 className="color_green font_large">User Details</h3>

          <button onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="var(--text-dark)"><path d="M256-213.85 213.85-256l224-224-224-224L256-746.15l224 224 224-224L746.15-704l-224 224 224 224L704-213.85l-224-224-224 224Z"/></svg>
          </button>
        </div>

        <div className="modal-body mt_sm">

          <div className="detail-row">
            <p>Name</p>
            <span>{user.name}</span>
          </div>

          <div className="detail-row">
            <p>Email</p>
            <span>{user.email}</span>
          </div>

          <div className="detail-row">
            <p>Role</p>
            <span>{user.role}</span>
          </div>

          <div className="detail-row">
            <p>Provider</p>
            <span>{user.provider || "Local"}</span>
          </div>

          <div className="detail-row">
            <p>Joined</p>
            <span>
              {new Date(user.createdAt).toLocaleString()}
            </span>
          </div>

          <div className="detail-row">
            <p>Last Updated</p>
            <span>
              {new Date(user.updatedAt).toLocaleString()}
            </span>
          </div>

          <div className="detail-row">
            <p>User ID</p>
            <span>{user._id}</span>
          </div>

        </div>

        {/* <div className="modal-footer">
          <button onClick={onClose}>
            Close
          </button>
        </div> */}

      </div>
    </div>
  );
}

export default ViewUserModal;