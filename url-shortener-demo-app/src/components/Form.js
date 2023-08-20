import React, { useState } from "react";
import { nanoid } from "nanoid";
import { getDatabase, child, ref, set, get } from "firebase/database";
import { isWebUri } from "valid-url";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

const Form = () => {
  const [parameters, setParameters] = useState({
    longURL: "",
    preferredAlias: "",
    generatedURL: "",
    loading: "",
    errors: [],
    errorMessage: {},
    toolTipMessage: "Copy to Clip Board",
  });

  const hasError = (key) => {
    return parameters.errors.indexOf(key) !== -1;
  };
  const handleChange = (e) => {
    const { id, value } = e.target;
    setParameters((previousState) => ({
      ...previousState,
      [id]: value,
    }));
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    setParameters((previousState) => {
      return { ...previousState, loading: true, generatedURL: "" };
    });
    let isFormValid = await validInput();
    if (!isFormValid) {
      return;
    }
    let generatedKey = nanoid(5);
    let generatedURL = "minilinkit.com" + generatedKey;

    if (setParameters.preferredAlias !== "") {
      generatedKey = parameters.preferredAlias;
      generatedURL = "minilinkit.com/" + parameters.preferredAlias;
    }

    const db = getDatabase();
    set(ref(db, "/" + generatedKey), {
      generatedKey: generatedKey,
      longURL: parameters.longURL,
      preferredAlias: parameters.preferredAlias,
      generatedURL: generatedURL,
    }).then((result) => {
      setParameters({
        generatedURL: generatedURL,
        loading: false,
      }).catch((e) => {});
    });
  };
  const validInput = async () => {
    let errors = [];
    let errorMessages = parameters.errorMessage;

    if (parameters.longURL.length === 0) {
      errors.push("LongURL");
      errorMessages["LongURL"] = "Please enter your URL";
    } else if (!isWebUri(parameters.longURL)) {
      errors.push("longURL");
      errorMessages["LongURL"] = "Please a URL in the form of https://www....";
    }
    if (parameters.preferredAlias !== "") {
      if (parameters.preferredAlias.length > 7) {
        errors.push("suggestedAlias");
        errorMessages["suggestedAlias"] =
          "Please Enter an Alias less than 7 Characters";
      } else if (parameters.preferredAlias.indexOf(" ") >= 0) {
        errors.push("suggestedAlias");
        errorMessages["suggestedAlias"] = "Spaces are not allowed in URLS";
      }

      let keyExists = await checkKeyExists();

      if (keyExists.exists()) {
        errors.push("suggestedAlias");
        errorMessages["suggestedAlias"] =
          "The Alias you have entered already exists! Please enter another one =-)";
      }
    }

    setParameters({
      errors: errors,
      errorMessages: errorMessages,
      loading: false,
    });

    if (errors.length > 0) {
      return false;
    }

    return true;
  };

  const checkKeyExists = async () => {
    const dbRef = ref(getDatabase());
    return get(child(dbRef, `/${parameters.preferredAlias}`)).catch((error) => {
      return false;
    });
  };

  const copyToClipBoard = () => {
    navigator.clipboard.writeText(parameters.generatedURL);
    setParameters({
      toolTipMessage: "Copied!",
    });
  };
  return (
    <div className="container">
      <Form autoComplete="off">
        <h3>Mini Link It!</h3>

        <div className="form-group">
          <label>Enter Your Long URL</label>
          <input
            id="longURL"
            onChange={handleChange}
            value={parameters.longURL}
            type="url"
            required
            className={
              hasError("longURL") ? "form-control is-invalid" : "form-control"
            }
            placeholder="https://www..."
          />
        </div>
        <div
          className={hasError("longURL") ? "text-danger" : "visually-hidden"}
        >
          {parameters.errorMessage.longURL}
        </div>

        <div className="form-group">
          <label htmlFor="basic-url">Your Mini URL</label>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">minilinkit.com/</span>
            </div>
            <input
              id="preferredAlias"
              onChange={handleChange}
              value={parameters.preferredAlias}
              className={
               hasError("preferredAlias")
                  ? "form-control is-invalid"
                  : "form-control"
              }
              type="text"
              placeholder="eg. 3fwias (Optional)"
            />
          </div>
          <div
            className={
              hasError("suggestedAlias") ? "text-danger" : "visually-hidden"
            }
          >
            {parameters.errorMessage.suggestedAlias}
          </div>
        </div>

        <button
          className="btn btn-primary"
          type="button"
          onClick={onSubmit}
        >
          {parameters.loading ? (
            <div>
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            </div>
          ) : (
            <div>
              <span
                className="visually-hidden spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              <span>Mini Link It</span>
            </div>
          )}
        </button>

        {parameters.generatedURL === "" ? (
          <div></div>
        ) : (
          <div className="generatedurl">
            <span>Your generated URL is: </span>
            <div className="input-group mb-3">
              <input
                disabled
                type="text"
                value={parameters.generatedURL}
                className="form-control"
                placeholder="Recipient's username"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
              />
              <div className="input-group-append">
                <OverlayTrigger
                  key={"top"}
                  placement={"top"}
                  overlay={
                    <Tooltip id={`tooltip-${"top"}`}>
                      {parameters.toolTipMessage}
                    </Tooltip>
                  }
                >
                  <button
                    onClick={copyToClipBoard}
                    data-toggle="tooltip"
                    data-placement="top"
                    title="Tooltip on top"
                    className="btn btn-outline-secondary"
                    type="button"
                  >
                    Copy
                  </button>
                </OverlayTrigger>
              </div>
            </div>
          </div>
        )}
      </Form>
    </div>
  );
};
export default Form;