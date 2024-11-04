// Remove supertokens dependency and replace with mock auth
export const passwordlessSignIn = async (email: string) => {
  try {
    // Mock successful sign in
    return { status: "OK" };
  } catch (err) {
    console.error(err);
    throw err;
  }
};