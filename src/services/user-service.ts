import creat from "./http-service";

export interface User {
  _id: string;
  name: string;
  email: string;
  phoneNo: string;
  title: string;
  gender: string;
}

export default creat("/user");
