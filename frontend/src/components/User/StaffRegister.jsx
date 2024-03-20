import { useEffect, useState } from "react";
import { useAuthContext } from "../../customHooks/useAuthContext";
import { alertClasses } from "@mui/material";

const StaffRegister = () => {
  const { user } = useAuthContext();

  const [error, setError] = useState(null);

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [roleType, setRoleType] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if(!username || !name || !password || !passwordCheck || !roleType){
        setError("One or More Field Is Empty");
        return;
    }

    if(password !== passwordCheck){
        setError("Password Check Failed... Retype");
        return;
    }

    const sendData = async () => {
        let role = 0;
        if(roleType === "ws"){
            role = 2;
        } else if (roleType === "sm") {
            role = 3;
        }

        if(user){
            const response = await fetch(
                "http://localhost:4000/api/user/register",
                {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${user.token}`,
                    },
                    body: JSON.stringify({
                        username,
                        name,
                        password,
                        role,
                    })
                })

                const jsonData = await response.json();

                if(!response.ok) {
                    setError(jsonData.error)
                }

                if(response.ok) {
                    alert(jsonData.msg);
                    setUsername('');
                    setName('');
                    setPassword('');
                    setPasswordCheck('');
                    setRoleType('');
                    setError('');
                }
        } else {
            setError('No User')
        }
    }
    try {
        sendData();   
    } catch (error) {
        setError(error)
    }
  };

  return (
    <div className="add-product">
      <form>
        <h1>Register Staff</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Re-Password"
          value={passwordCheck}
          onChange={(e) => setPasswordCheck(e.target.value)}
        />
        <div className="selection-container">
          <select
            defaultValue={roleType}
            onChange={(e) => setRoleType(e.target.value)}
          >
            <option value="" disabled>
              Chose Role
            </option>
            <option value="ws">
            Warehouse Staff
            </option>
            <option value="sm">
            Store Manager
            </option>
          </select>
          <button onClick={handleSubmit}>Submit</button>
        </div>
        {error && <h2 className="error-show">{error}</h2>}
      </form>
    </div>
  );
};

export default StaffRegister;
