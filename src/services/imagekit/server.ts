"use server";

import ImageKit from "imagekit";
import { env as clientEnv } from "~/data/env/client";
import { env as serverEnv } from "~/data/env/server";

const imagekit = new ImageKit({
  publicKey: clientEnv.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: clientEnv.NEXT_PUBLIC__IMAGEKIT_URL_ENDPOINT,
  privateKey: serverEnv.IMAGEKIT_PRIVATE_KEY,
});

export async function getImagekitAuthParameters() {
  return imagekit.getAuthenticationParameters();
}
