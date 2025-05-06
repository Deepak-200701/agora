import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

function Sidebar() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null)
  const [isUsersLoading, setIsIsersLoading] = useState(false)
  const [searchParams, setSeachParams] = useSearchParams()

  const API_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    fetchUser()
  }, []);

  const fetchUser = async () => {
    try {
      setIsIsersLoading(true);
      const { data } = await axios.get(`${API_URL}/user`);
      setUsers([...data?.data]);
    }
    catch (error) {
      console.log(error);
    }
    finally {
      setIsIsersLoading(false);
    }
  }

  const onSelectUser = (userId) => {
    const isAvailable = searchParams.get("user")

    if (isAvailable) {
      searchParams.delete("user");
      searchParams.append("user", userId);
      setSeachParams(searchParams);
    }
    else {
      searchParams.append("user", userId);
      setSeachParams(searchParams);
    }
    setSelectedUser(userId)
  }


  return (
    <div className="w-1/5 bg-blue-600 text-white border-r p-4 min-h-full">
      <h2 className="text-xl font-semibold mb-4">Chats</h2>
      <hr />
      <div className='mt-4'>
        <ul>
          {users && users?.length ?
            users.map((user) => (
              <li
                key={user.username}
                onClick={() => onSelectUser(user.username)}
                className={`
                  p-2 rounded cursor-pointer 
                  ${user.username === searchParams.get("user") ? ' bg-gray-500' : ""}
                `}
              >
                {user.username}
              </li>
            )) : <></>
          }
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
