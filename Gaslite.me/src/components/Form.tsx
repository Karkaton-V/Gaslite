interface Props {
  onClose: () => void;
}

const Form = ({ onClose }: Props) => {
  return (
    <form className="row g-3 needs-validation" noValidate>
      <div className="col-sm-1 offset-md-11">
        <div className="row align-items-right">
          <button
            className="btn-close"
            type="button"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
      </div>
      <div className="col-md-4 offset-md-4">
        <div className="row align-items-center">
          <label form="validationCustomUsername" className="form-label">
            Username
          </label>
          <div className="input-group has-validation">
            <input
              type="text"
              className="form-control"
              id="validationCustomUsername"
              aria-describedby="inputGroupPrepend"
              required
            ></input>
            <div className="invalid-feedback">Please choose a username.</div>
          </div>
        </div>
      </div>

      <div className="row align-items-center">
        <div className="col-md-6 offset-md-4">
          <label form="validationCustomPassword" className="form-label">
            Password
          </label>
          <input
            type="text"
            className="form-control"
            id="validationCustomPassword"
            required
          ></input>
          <div className="invalid-feedback">Incorrect Password.</div>
        </div>
      </div>
      <div className="col-12 offset-md-5">
        <button className="btn btn-primary" type="submit">
          Login
        </button>
      </div>
    </form>
  );
};

export default Form;
