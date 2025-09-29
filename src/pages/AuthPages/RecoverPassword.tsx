import PageMeta from "../../components/common/PageMeta";
import ForgottenPassword from "../../components/auth/ForgottenPassword";
import AuthLayout from "./AuthPageLayout";

export default function RecoverPassword() {
  return (
    <>
      <PageMeta
        title="Recuperar contraseña | ITZEL - Next.js Admin Dashboard Template"
        description="Página para recuperar contraseña en ITZEL - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <ForgottenPassword />
      </AuthLayout>
    </>
  );
}