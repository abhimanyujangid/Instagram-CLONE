import path from "path";

const inputData = [
    {
      type: "text",
      placeholder: "Full Name",
      name: "fullName",

    },
    {
      type: "text",
      placeholder: "Username",
      name: "username",
    },
    {
      type: "email",
      placeholder: "Email",
      name: "email",
    },
    {
      type: "password",
      placeholder: "Password",
      name: "password",
    },
    {
      type: "password",
      placeholder: "Confirm Password",
      name: "confirmPassword",
    }
  ];


  const navData = [
    { id: 1, name: "Home", icon: "HouseIcon", path : "/home" },
    { id: 2, name: "Profile", icon: "UserIcon", path : "/profile" },
    { id: 3, name: "Notifications", icon: "BellIcon", path : "/notifications" },
    { id: 4, name: "Messages", icon: "MessageSquare", path : "/messages" },
    { id: 5, name: "Search", icon: "Search", path : "/search" },
    { id: 6, name: "Settings", icon: "Settings", path : "/settings" },
  ];

  export  {inputData, navData};