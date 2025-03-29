import { getImagekitAuthParameters } from "./server";

export async function authenticator() {
  const response = await getImagekitAuthParameters();
  if (!response) throw new Error("Failed to get imagekit auth parameters");

  return response;
}
