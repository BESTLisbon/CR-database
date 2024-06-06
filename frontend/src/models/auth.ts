// Define the shape of authentication context
type UserDTO = {
  email: string;
  name: string;
  role: string;
};

type AuthDTO = {
  accessToken: string;
  refreshToken?: string;
};

type AuthResponseType = {
  user: UserDTO;
  auth: AuthDTO;
};

export type { AuthResponseType };
