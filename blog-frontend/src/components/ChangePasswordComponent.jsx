import { useState } from "react";
import { useChangePasswordMutation } from "../redux-toolkit/features/userProfile/profileApiSlice";
import { useNavigate } from "react-router-dom";

const ChangePasswordComponent = () => {
  const [ChangePasswordInput, setChangePasswordInput] = useState({
    oldPassword: "",
    newPassword: "",
    secondNewPassword: "",
  });

  const navigate = useNavigate();

  const [changePassword, { isLoading, isError, error }] =
    useChangePasswordMutation();

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (
      ChangePasswordInput.newPassword !== ChangePasswordInput.secondNewPassword
    ) {
      alert("you should type the same new password in the inputs");
      return;
    }
    try {
      const { data } = await changePassword({
        oldPassword: ChangePasswordInput.oldPassword,
        newPassword: ChangePasswordInput.newPassword,
      }).unwrap();
      alert(data?.message || "the password has changed successfully");
      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ marginTop: "20px" }}>
      {isError && (
        <p>
          {error?.data?.message || "something went wrong! , please try again"}
        </p>
      )}
      <form onSubmit={handelSubmit}>
        <fieldset>
          <label htmlFor="oldPassword">Enter the old Password</label>
          <input
            type="text"
            placeholder="The old Password"
            value={ChangePasswordInput.oldPassword}
            onChange={(e) =>
              setChangePasswordInput({
                ...ChangePasswordInput,
                oldPassword: e.target.value,
              })
            }
          />
        </fieldset>
        <fieldset>
          <label htmlFor="newPassword">Enter the new Password</label>
          <input
            type="text"
            placeholder="The new Password"
            value={ChangePasswordInput.newPassword}
            onChange={(e) =>
              setChangePasswordInput({
                ...ChangePasswordInput,
                newPassword: e.target.value,
              })
            }
          />
        </fieldset>
        <fieldset>
          <label htmlFor="newPassword">Enter the new Password</label>
          <input
            type="text"
            placeholder="The new Password"
            value={ChangePasswordInput.secondnewPassword}
            onChange={(e) =>
              setChangePasswordInput({
                ...ChangePasswordInput,
                secondNewPassword: e.target.value,
              })
            }
          />
        </fieldset>
        <button type="submit">
          {isLoading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordComponent;
